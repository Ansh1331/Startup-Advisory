"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Set advisor's availability slots
 */
export async function setAvailabilitySlots(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the advisor
    const advisor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADVISOR",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    // Get form data
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    // Validate input
    if (!startTime || !endTime) {
      throw new Error("Start time and end time are required");
    }

    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // Check if the advisor already has slots
    const existingSlots = await db.availability.findMany({
      where: {
        advisorId: advisor.id,
      },
    });

    // If slots exist, delete them all (we're replacing them)
    if (existingSlots.length > 0) {
      // Don't delete slots that already have appointments
      const slotsWithNoAppointments = existingSlots.filter(
        (slot) => !slot.appointment
      );

      if (slotsWithNoAppointments.length > 0) {
        await db.availability.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointments.map((slot) => slot.id),
            },
          },
        });
      }
    }

    // Create new availability slot
    const newSlot = await db.availability.create({
      data: {
        advisorId: advisor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });

    revalidatePath("/advisor");
    return { success: true, slot: newSlot };
  } catch (error) {
    console.error("Failed to set availability slots:", error);
    throw new Error("Failed to set availability: " + error.message);
  }
}

/**
 * Get advisor's current availability slots
 */
export async function getAdvisorAvailability() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const advisor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADVISOR",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    const availabilitySlots = await db.availability.findMany({
      where: {
        advisorId: advisor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { slots: availabilitySlots };
  } catch (error) {
    throw new Error("Failed to fetch availability slots " + error.message);
  }
}

/**
 * Get advisor's upcoming appointments
 */

export async function getAdvisorAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const advisor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADVISOR",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        advisorId: advisor.id,
        status: {
          in: ["SCHEDULED"],
        },
      },
      include: {
        founder: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    throw new Error("Failed to fetch appointments " + error.message);
  }
}

/**
 * Cancel an appointment (can be done by both advisor and founder)
 */
export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment with both founder and advisor details
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        founder: true,
        advisor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the advisor or the founder for this appointment
    if (appointment.advisorId !== user.id && appointment.founderId !== user.id) {
      throw new Error("You are not authorized to cancel this appointment");
    }

    // Perform cancellation in a transaction
    await db.$transaction(async (tx) => {
      // Update the appointment status to CANCELLED
      await tx.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      // Always refund credits to founder and deduct from advisor
      // Create credit transaction for founder (refund)
      await tx.creditTransaction.create({
        data: {
          userId: appointment.founderId,
          amount: 2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Create credit transaction for advisor (deduction)
      await tx.creditTransaction.create({
        data: {
          userId: appointment.advisorId,
          amount: -2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Update founder's credit balance (increment)
      await tx.user.update({
        where: {
          id: appointment.founderId,
        },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      // Update advisor's credit balance (decrement)
      await tx.user.update({
        where: {
          id: appointment.advisorId,
        },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });
    });

    // Determine which path to revalidate based on user role
    if (user.role === "ADVISOR") {
      revalidatePath("/advisor");
    } else if (user.role === "FOUNDER") {
      revalidatePath("/appointments");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}

/**
 * Add notes to an appointment
 */
export async function addAppointmentNotes(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const advisor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADVISOR",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    const appointmentId = formData.get("appointmentId");
    const notes = formData.get("notes");

    if (!appointmentId || !notes) {
      throw new Error("Appointment ID and notes are required");
    }

    // Verify the appointment belongs to this advisor
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        advisorId: advisor.id,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Update the appointment notes
    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes,
      },
    });

    revalidatePath("/advisor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Failed to add appointment notes:", error);
    throw new Error("Failed to update notes: " + error.message);
  }
}

/**
 * Mark an appointment as completed (only by advisor after end time)
 */
export async function markAppointmentCompleted(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const advisor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADVISOR",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        advisorId: advisor.id, // Ensure appointment belongs to this advisor
      },
      include: {
        founder: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found or not authorized");
    }

    // Check if appointment is currently scheduled
    if (appointment.status !== "SCHEDULED") {
      throw new Error("Only scheduled appointments can be marked as completed");
    }

    // Check if current time is after the appointment end time
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);

    if (now < appointmentEndTime) {
      throw new Error(
        "Cannot mark appointment as completed before the scheduled end time"
      );
    }

    // Update the appointment status to COMPLETED
    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath("/advisor");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Failed to mark appointment as completed:", error);
    throw new Error(
      "Failed to mark appointment as completed: " + error.message
    );
  }
}

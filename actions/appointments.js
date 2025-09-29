"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deductCreditsForAppointment } from "@/actions/credits";
import { Vonage } from "@vonage/server-sdk";
import { addDays, addMinutes, format, isBefore, endOfDay } from "date-fns";
import { Auth } from "@vonage/auth";

// Initialize Vonage Video API client
const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
});
const options = {};
const vonage = new Vonage(credentials, options);


export async function bookAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the founder user
    const founder = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "FOUNDER",
      },
    });

    if (!founder) {
      throw new Error("Founder not found");
    }

    // Parse form data
    const advisorId = formData.get("advisorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const founderDescription = formData.get("description") || null;

    // Validate input
    if (!advisorId || !startTime || !endTime) {
      throw new Error("Advisor, start time, and end time are required");
    }

    // Check if the advisor exists and is verified
    const advisor = await db.user.findUnique({
      where: {
        id: advisorId,
        role: "ADVISOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found or not verified");
    }

    if (founder.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    // Check if the requested time slot is available
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        advisorId: advisorId,
        status: "SCHEDULED",
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            // New appointment ends during an existing appointment
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            // New appointment completely overlaps an existing appointment
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    // Create a new Vonage Video API session
    const sessionId = await createVideoSession();

    // Deduct credits from founder and add to advisor
    const { success, error } = await deductCreditsForAppointment(
      founder.id,
      advisor.id
    );

    if (!success) {
      throw new Error(error || "Failed to deduct credits");
    }

    // Create the appointment with the video session ID
    const appointment = await db.appointment.create({
      data: {
        founderId: founder.id,
        advisorId: advisor.id,
        startTime,
        endTime,
        founderDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId, // Store the Vonage session ID
      },
    });

    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw new Error("Failed to book appointment:" + error.message);
  }
}

/**
 * Generate a Vonage Video API session
 */
async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    return session.sessionId;
  } catch (error) {
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Generate a token for a video session
 * This will be called when either advisor or founder is about to join the call
 */
export async function generateVideoToken(formData) {
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

    // Find the appointment and verify the user is part of it
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the advisor or the founder for this appointment
    if (appointment.advisorId !== user.id && appointment.founderId !== user.id) {
      throw new Error("You are not authorized to join this call");
    }

    // Verify the appointment is scheduled
    if (appointment.status !== "SCHEDULED") {
      throw new Error("This appointment is not currently scheduled");
    }

    // Verify the appointment is within a valid time range (e.g., starting 5 minutes before scheduled time)
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = (appointmentTime - now) / (1000 * 60); // difference in minutes

    if (timeDifference > 30) {
      throw new Error(
        "The call will be available 30 minutes before the scheduled time"
      );
    }

    // Generate a token for the video session
    // Token expires 2 hours after the appointment start time
    const appointmentEndTime = new Date(appointment.endTime);
    const expirationTime =
      Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60; // 1 hour after end time

    // Use user's name and role as connection data
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    // Generate the token with appropriate role and expiration
    const token = vonage.video.generateClientToken(appointment.videoSessionId, {
      role: "publisher", // Both advisor and founder can publish streams
      expireTime: expirationTime,
      data: connectionData,
    });

    // Update the appointment with the token
    await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        videoSessionToken: token,
      },
    });

    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token: token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    throw new Error("Failed to generate video token:" + error.message);
  }
}


export async function getAdvisorById(advisorId) {
  try {
    const advisor = await db.user.findUnique({
      where: {
        id: advisorId,
        role: "ADVISOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    return { advisor };
  } catch (error) {
    console.error("Failed to fetch advisor:", error);
    throw new Error("Failed to fetch advisor details");
  }
}


export async function getAvailableTimeSlots(advisorId) {
  try {
    const advisor = await db.user.findUnique({
      where: {
        id: advisorId,
        role: "ADVISOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!advisor) {
      throw new Error("Advisor not found or not verified");
    }

    // Fetch a single availability record
    const availability = await db.availability.findFirst({
      where: {
        advisorId: advisor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No availability set by advisor");
    }

    // Get the next 4 days
    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    // Fetch existing appointments for the advisor over the next 4 days
    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        advisorId: advisor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay = {};

    // For each of the next 4 days, generate available slots
    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      // Create a copy of the availability start/end times for this day
      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      // Set the day to the current day we're processing
      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );
      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        // Skip past slots
        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    // Convert to array of slots grouped by day for easier consumption by the UI
    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}

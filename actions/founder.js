import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get all appointments for the authenticated founder
 */
export async function getFounderAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "FOUNDER",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("Founder not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        founderId: user.id,
      },
      include: {
        advisor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Failed to get founder appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
}

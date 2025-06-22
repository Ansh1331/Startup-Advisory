"use server";

import { db } from "@/lib/prisma";

/**
 * Get advisors by specialty
 */
export async function getAdvisorsBySpecialty(specialty) {
  try {
    const advisors = await db.user.findMany({
      where: {
        role: "ADVISOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });

    return { advisors };
  } catch (error) {
    console.error("Failed to fetch advisors by specialty:", error);
    return { error: "Failed to fetch advisors" };
  }
}

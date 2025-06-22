import { getAdvisorById, getAvailableTimeSlots } from "@/actions/appointments";
import { AdvisorProfile } from "./_components/advisor-profile";
import { redirect } from "next/navigation";

export default async function AdvisorProfilePage({ params }) {
  const { id } = await params;

  try {
    // Fetch advisor data and available slots in parallel
    const [advisorData, slotsData] = await Promise.all([
      getAdvisorById(id),
      getAvailableTimeSlots(id),
    ]);

    return (
      <AdvisorProfile
        advisor={advisorData.advisor}
        availableDays={slotsData.days || []}
      />
    );
  } catch (error) {
    console.error("Error loading advisor profile:", error);
    redirect("/advisors");
  }
}

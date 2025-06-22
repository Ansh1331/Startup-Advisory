import { redirect } from "next/navigation";
import { getAdvisorsBySpecialty } from "@/actions/advisors-listing";
import { AdvisorCard } from "../components/advisor-card";
import { PageHeader } from "@/components/page-header";

export default async function AdvisorSpecialtyPage({ params }) {
  const { specialty } = await params;

  // Redirect to main advisors page if no specialty is provided
  if (!specialty) {
    redirect("/advisors");
  }

  // Fetch advisors by specialty
  const { advisors, error } = await getAdvisorsBySpecialty(specialty);

  if (error) {
    console.error("Error fetching advisors:", error);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.split("%20").join(" ")}
        backLink="/advisors"
        backLabel="All Specialties"
      />

      {advisors && advisors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advisors.map((advisor) => (
            <AdvisorCard key={advisor.id} advisor={advisor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No advisors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified advisors in this specialty. Please
            check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
}

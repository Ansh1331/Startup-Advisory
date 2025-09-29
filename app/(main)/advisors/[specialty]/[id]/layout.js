import { getAdvisorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { advisor } = await getAdvisorById(id);
  return {
    title: `${advisor.name} - StartupConnect`,
    description: `Book an appointment with ${advisor.name}, ${advisor.specialty} specialist with ${advisor.experience} years of experience.`,
  };
}

export default async function AdvisorProfileLayout({ children, params }) {
  const { id } = await params;
  const { advisor } = await getAdvisorById(id);

  if (!advisor) redirect("/advisors");

  return (
    <div className="container mx-auto">
      <PageHeader
        title={advisor.name}
        backLink={`/advisors/${advisor.specialty}`}
        backLabel={`Back to ${advisor.specialty}`}
      />

      {children}
    </div>
  );
}

import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Advisor Dashboard - StartupConnect",
  description: "Manage your appointments and availability",
};

export default async function AdvisorDashboardLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<GraduationCap />} title="Advisor Dashboard" />

      {children}
    </div>
  );
}

import { TabsContent } from "@/components/ui/tabs";
import { PendingAdvisors } from "./components/pending-advisors";
import { VerifiedAdvisors } from "./components/verified-advisors";
import { PendingPayouts } from "./components/pending-payouts";
import {
  getPendingAdvisors,
  getVerifiedAdvisors,
  getPendingPayouts,
} from "@/actions/admin";

export default async function AdminPage() {
  
  const [pendingAdvisorsData, verifiedAdvisorsData, pendingPayoutsData] =
    await Promise.all([
      getPendingAdvisors(),
      getVerifiedAdvisors(),
      getPendingPayouts(),
    ]);

  return (
    <>
      <TabsContent value="pending" className="border-none p-0">
        <PendingAdvisors advisors={pendingAdvisorsData.advisors || []} />
      </TabsContent>

      <TabsContent value="advisors" className="border-none p-0">
        <VerifiedAdvisors advisors={verifiedAdvisorsData.advisors || []} />
      </TabsContent>

      <TabsContent value="payouts" className="border-none p-0">
        <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
      </TabsContent>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  User,
  DollarSign,
  Mail,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { approvePayout } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  // Custom hook for approve payout server action
  const { loading, data, fn: submitApproval } = useFetch(approvePayout);

  // Handle view details
  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
  };

  // Handle approve payout
  const handleApprovePayout = (payout) => {
    setSelectedPayout(payout);
    setShowApproveDialog(true);
  };

  // Confirm approval
  const confirmApproval = async () => {
    if (!selectedPayout || loading) return;

    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);

    await submitApproval(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowApproveDialog(false);
      setSelectedPayout(null);
      toast.success("Payout approved successfully!");
    }
  }, [data]);

  const closeDialogs = () => {
    setSelectedPayout(null);
    setShowApproveDialog(false);
  };

  return (
    <div>
      <Card className="bg-muted/20 border-cyan-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Pending Payouts
          </CardTitle>
          <CardDescription>
            Review and approve advisor payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending payout requests at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <Card
                  key={payout.id}
                  className="bg-background border-cyan-900/20 hover:border-cyan-700/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted/20 rounded-full p-2 mt-1">
                          <User className="h-5 w-5 text-cyan-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {payout.advisor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {payout.advisor.specialty}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-cyan-300" />
                              <span>
                                {payout.credits} credits • $
                                {payout.netAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-cyan-300" />
                              <span className="text-xs">
                                {payout.paypalEmail}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested{" "}
                            {format(
                              new Date(payout.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 self-end lg:self-center">
                        <Badge
                          variant="outline"
                          className="bg-amber-900/20 border-amber-900/30 text-amber-400 w-fit"
                        >
                          Pending
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payout)}
                            className="border-cyan-900/30 hover:bg-muted/80"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprovePayout(payout)}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      {selectedPayout && !showApproveDialog && (
        <Dialog open={!!selectedPayout} onOpenChange={closeDialogs}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Payout Request Details
              </DialogTitle>
              <DialogDescription>
                Review the payout request information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Advisor Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-cyan-300" />
                  <h3 className="text-white font-medium">Advisor Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-white">
                      {selectedPayout.advisor.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-white">{selectedPayout.advisor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Specialty
                    </p>
                    <p className="text-white">
                      {selectedPayout.advisor.specialty}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Credits
                    </p>
                    <p className="text-white">
                      {selectedPayout.advisor.credits}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-300" />
                  <h3 className="text-white font-medium">Payout Details</h3>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg border border-cyan-900/20 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Credits to pay out:
                    </span>
                    <span className="text-white font-medium">
                      {selectedPayout.credits}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Gross amount (10 USD/credit):
                    </span>
                    <span className="text-white">
                      ${selectedPayout.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Platform fee (2 USD/credit):
                    </span>
                    <span className="text-white">
                      -${selectedPayout.platformFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-cyan-900/20 pt-3 flex justify-between font-medium">
                    <span className="text-white">Net payout:</span>
                    <span className="text-cyan-300">
                      ${selectedPayout.netAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-cyan-900/20 pt-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      PayPal Email
                    </p>
                    <p className="text-white">{selectedPayout.paypalEmail}</p>
                  </div>
                </div>
              </div>

              {/* Warning if insufficient credits */}
              {selectedPayout.advisor.credits < selectedPayout.credits && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Advisor currently has only{" "}
                    {selectedPayout.advisor.credits} credits but this payout
                    requires {selectedPayout.credits} credits. The payout cannot
                    be processed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeDialogs}
                className="border-cyan-900/30"
              >
                Close
              </Button>
              <Button
                onClick={() => handleApprovePayout(selectedPayout)}
                disabled={
                  selectedPayout.advisor.credits < selectedPayout.credits
                }
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Confirmation Dialog */}
      {showApproveDialog && selectedPayout && (
        <Dialog
          open={showApproveDialog}
          onOpenChange={() => setShowApproveDialog(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Confirm Payout Approval
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this payout?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will:
                  <ul className="mt-2 space-y-1 list-disc pl-4">
                    <li>
                      Deduct {selectedPayout.credits} credits from {" "}
                      {selectedPayout.advisor.name}'s account
                    </li>
                    <li>Mark the payout as PROCESSED</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/20 p-4 rounded-lg border border-cyan-900/20">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Advisor:</span>
                  <span className="text-white">
                    {selectedPayout.advisor.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="text-cyan-300 font-medium">
                    ${selectedPayout.netAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PayPal:</span>
                  <span className="text-white text-sm">
                    {selectedPayout.paypalEmail}
                  </span>
                </div>
              </div>
            </div>

            {loading && <BarLoader width={"100%"} color="#36d7b7" />}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                disabled={loading}
                className="border-cyan-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

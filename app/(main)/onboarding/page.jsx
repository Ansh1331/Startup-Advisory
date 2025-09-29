"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserRole } from "@/actions/onboarding";
import { advisorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  // Custom hook for user role server action
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(advisorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  // Watch specialty value for controlled select component
  const specialtyValue = watch("specialty");

  // Handle founder role selection
  const handleFounderSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "FOUNDER");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
    }
  }, [data]);

  // Added missing onAdvisorSubmit function
  const onAdvisorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "ADVISOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-cyan-900/20 hover:border-cyan-700/40 cursor-pointer transition-all"
          onClick={() => !loading && handleFounderSelection()}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-cyan-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-cyan-300" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Founder
            </CardTitle>
            <CardDescription className="mb-4">
              Book sessions, connect with expert advisors, and grow your startup journey.
            </CardDescription>
            <Button
              className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue as Founder"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-cyan-900/20 hover:border-cyan-700/40 cursor-pointer transition-all"
          onClick={() => !loading && setStep("advisor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-cyan-900/20 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-cyan-300" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Advisor
            </CardTitle>
            <CardDescription className="mb-4">
              Showcase your expertise, manage your schedule, and advise founders who need your guidance.
            </CardDescription>
            <Button
              className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700"
              disabled={loading}
            >
              Continue as Advisor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Advisor registration form
  if (step === "advisor-form") {
    return (
      <Card className="border-cyan-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete Your Advisor Profile
            </CardTitle>
            <CardDescription>
              Please provide your professional details for verification
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit(onAdvisorSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="specialty">Business Specialty</Label>
              <Select
                value={specialtyValue}
                onValueChange={(value) => setValue("specialty", value)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem
                      key={spec.name}
                      value={spec.name}
                      className="flex items-center gap-2"
                    >
                      <span className="text-cyan-300">{spec.icon}</span>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.specialty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="e.g. 5"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Link to Credential Document</Label>
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://example.com/my-advisor-degree.pdf"
                {...register("credentialUrl")}
              />
              {errors.credentialUrl && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.credentialUrl.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Please provide a link to the documentation supporting your expertise
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Your Services</Label>
              <Textarea
                id="description"
                placeholder="Describe your expertise, services, and approach to founder care..."
                rows="4"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose-role")}
                className="border-cyan-900/30"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}

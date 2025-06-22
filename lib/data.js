import {
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";

// JSON data for features
export const features = [
  {
    icon: <User className="h-6 w-6 text-cyan-300" />,
    title: "Create Your Profile",
    description:
      "Sign up as a founder or advisor and set up your profile to start connecting on the platform.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-cyan-300" />,
    title: "Book Sessions",
    description:
      "Browse advisor profiles, check their availability, and book 1:1 consultation sessions.",
  },
  {
    icon: <Video className="h-6 w-6 text-cyan-300" />,
    title: "Video Consultation",
    description:
      "Join secure video calls with startup advisors and get expert guidance in real time.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-cyan-300" />,
    title: "Subscription Plans",
    description:
      "Choose a monthly subscription to unlock session bookings without any hidden costs.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-cyan-300" />,
    title: "Verified Advisors",
    description:
      "All advisors are screened and approved by our admin team to ensure quality guidance.",
  },
  {
    icon: <FileText className="h-6 w-6 text-cyan-300" />,
    title: "Session History",
    description:
      "Easily access your past consultations, advisor notes, and session-related details.",
  },
];


// JSON data for testimonials
export const testimonials = [
  {
    initials: "AK",
    name: "Ankit K.",
    role: "Founder",
    quote:
      "The video consultation feature helped me get expert startup advice without wasting time. It’s like having a mentor on demand.",
  },
  {
    initials: "RS",
    name: "Riya S.",
    role: "Startup Advisor",
    quote:
      "This platform has transformed how I work with early-stage founders. I can connect, advise, and manage sessions — all in one place.",
  },
  {
    initials: "MD",
    name: "Manav D.",
    role: "Founder",
    quote:
      "The subscription system makes it easy to book sessions. I’ve received valuable guidance on product strategy and fundraising.",
  },
];


// JSON data for credit system benefits
export const creditBenefits = [
  "Each consultation requires <strong class='text-cyan-300'>2 credits</strong> regardless of duration",
  "Credits <strong class='text-cyan-300'>never expire</strong> - use them whenever you need",
  "Monthly subscriptions give you <strong class='text-cyan-300'>fresh credits every month</strong>",
  "Cancel or change your subscription <strong class='text-cyan-300'>anytime</strong> without penalties",
];

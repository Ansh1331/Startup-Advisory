import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricing";
import { creditBenefits, features, testimonials } from "@/lib/data";

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src="/banner1.jpg"
                alt="Advisor consultation"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="space-y-8">
              <Badge
                variant="outline"
                className="bg-cyan-900/30 border-cyan-700/30 px-4 py-2 text-cyan-300 text-sm font-medium"
              >
              🚀 Launch smarter, faster
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connect with advisors <br />
                <span className="gradient-title">anytime, anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book consultations, get expert advice via video, and manage your startup journey — all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  <Link href="/onboarding">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-cyan-700/30 hover:bg-muted/80"
                >
                  <Link href="/advisors">Find Advisors</Link>
                </Button>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert startup advice is just a few clicks away
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card border-cyan-900/20 hover:border-cyan-800/40 transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="bg-cyan-900/20 p-3 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with green advisor styling */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-cyan-900/30 border-cyan-700/30 px-4 py-1 text-cyan-300 text-sm font-medium mb-4"
            >
              Expert Guidance, Made Accessible
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Flexible Advisory Packages
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pick a consultation plan that suits your startup journey and budget
            </p>
          </div>

          <div className="mx-auto">
            {/* Clerk Pricing Table */}
            <Pricing />

            {/* Description */}
            <Card className="mt-12 bg-muted/20 border-cyan-900/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-cyan-300" />
                  How Our Credit System Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 bg-cyan-900/20 p-1 rounded-full">
                        <svg
                          className="h-4 w-4 text-cyan-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: benefit }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials with green advisor accents */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-cyan-900/30 border-cyan-700/30 px-4 py-1 text-cyan-300 text-sm font-medium mb-4"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from founders and advisors who trust our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-cyan-900/20 hover:border-cyan-800/40 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-900/20 flex items-center justify-center mr-4">
                      <span className="text-cyan-300 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with green advisor styling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-cyan-900/30 to-cyan-950/20 border-cyan-800/20">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to take control of your startup journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of founders who are scaling smarter with expert advisory.
                  Get started today and build with confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    <Link href="/sign-up">Sign Up Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-cyan-700/30 hover:bg-muted/80"
                  >
                    <Link href="#pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>

          
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-cyan-800/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-cyan-700/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

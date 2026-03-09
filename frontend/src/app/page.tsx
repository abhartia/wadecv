import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FileText, Upload, Wand2, Download, CheckCircle, Sparkles, Shield, Zap, AlertTriangle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" /> AI-Powered CV Tailoring
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Land your dream job with a
              <span className="text-primary block mt-2">perfectly tailored CV</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Add a job, run a fit analysis to see how you match, then generate your tailored CV for free.
              Add clarifications on any gaps and our AI reframes your real experience for the role. Honest and interview-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start for Free
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              1 free credit on signup. No credit card required.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Job details → fit analysis (1 credit) → generate CV for free → edit & download
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20">01</div>
                <h3 className="text-xl font-semibold">Upload Your CV (Once)</h3>
                <p className="text-muted-foreground">
                  Upload your existing CV (PDF or DOCX) and optionally add extra details about your experience. We save this as your base profile so you don&apos;t have to re-upload every time.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wand2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20">02</div>
                <h3 className="text-xl font-semibold">Run Fit Analysis (1 credit)</h3>
                <p className="text-muted-foreground">
                  Paste a job URL or description and run fit analysis. You get a match score, strengths, and potential gaps.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20">03</div>
                <h3 className="text-xl font-semibold">Generate, Edit & Download</h3>
                <p className="text-muted-foreground">
                  Add clarifications on any gaps (or skip if they&apos;re all correct), then generate your tailored CV for free. Edit in the dashboard and download a polished DOCX, and get a free cover letter for the same role.
                </p>
              </div>
            </div>

            {/* Tailoring flow mock from dashboard */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="border-0 shadow-sm bg-background/60">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Fit Analysis Preview</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    A live score showing how well your profile matches each role
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 pt-2">
                  <div className="relative h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="56" fill="none" strokeWidth="10" className="stroke-muted" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${0.78 * 351.86} 351.86`}
                        className="stroke-green-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">78%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Strong match for this role. WadeCV highlights where you&apos;re already a great fit and surfaces the experience that matters most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-background/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Potential Gaps (Mock)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Add clarifications here, then generate your tailored CV for free—no extra credit.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      Limited explicit experience in Ad Tech measurement platforms, attribution, incrementality, or in-flight optimization
                    </div>
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      “I led measurement strategy for a global Ad Tech partner, including incrementality testing and in-flight bid optimization across multiple campaigns.”
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      No direct reference to launching external-facing measurement dashboards for agencies/advertisers
                    </div>
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                      “I owned the rollout of a self-serve analytics portal for 200+ enterprise advertisers, including UX, instrumentation, and GTM enablement.”
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your corrections feed back into your personal memory bank so every future CV generation gets smarter.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">Why WadeCV?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A tailored CV that actually sounds like you and is rooted in your real experience, not made‑up bullet points.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Sparkles, title: "AI-Powered", desc: "Uses advanced AI to tailor your CV for each specific job application." },
                { icon: Zap, title: "Lightning Fast", desc: "Get a professionally tailored CV in seconds, not hours of manual editing." },
                { icon: FileText, title: "ATS-Friendly", desc: "Clean formatting that passes Applicant Tracking Systems every time." },
                { icon: Shield, title: "Cover Letters", desc: "Generate matching cover letters for free with every tailored CV." },
                { icon: CheckCircle, title: "Track Applications", desc: "Keep track of all your job applications in one organized dashboard." },
                { icon: Download, title: "DOCX Export", desc: "Download your tailored CV as a professional Word document." },
              ].map((f, i) => (
                <Card key={i} className="border-0 shadow-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-6">
                    <f.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                1 credit = 1 fit analysis per job. CV generation and refinements for that job are free. Cover letters always free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Starter", credits: 20, price: "$10", per: "$0.50", popular: false },
                { name: "Value", credits: 50, price: "$15", per: "$0.30", popular: true },
                { name: "Pro", credits: 100, price: "$20", per: "$0.20", popular: false },
              ].map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg md:scale-105" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.credits} credits ({plan.per}/job)
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{plan.credits} job fit analyses (CV + refinements free per job)</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Free cover letters</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />DOCX downloads</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Application tracking</li>
                    </ul>
                    <Link href="/auth/register" className="block">
                      <Button className="w-full mt-4" variant={plan.popular ? "default" : "outline"}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Disclosure Banner */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              <Shield className="inline h-4 w-4 mr-1" />
              WadeCV uses AI to generate CVs and cover letters. All AI-generated content should
              be reviewed for accuracy before use. <Link href="/legal/ai-disclosure" className="underline hover:text-foreground">Learn more</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to land your next role?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start with 1 free credit. No credit card needed.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Your First Tailored CV
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

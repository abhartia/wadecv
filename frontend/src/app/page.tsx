import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FileText, Upload, Wand2, Download, CheckCircle, Sparkles, Shield, Zap } from "lucide-react";

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
              Upload your CV, paste a job link, and let AI help you surface and reframe the strongest parts of your
              real experience for a specific role. This isn&apos;t a hacky shortcut; it keeps your story honest so that
              when you do get the interview, you&apos;re still leaning on your own track record.
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
                Three simple steps from your existing CV to a tailored, role-specific version
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
                <h3 className="text-xl font-semibold">Add Job & See Your Fit</h3>
                <p className="text-muted-foreground">
                  Paste a job URL or description. Our AI scores how strong a fit you are for the role, highlights where you&apos;re a good match, and flags potential gaps.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary/20">03</div>
                <h3 className="text-xl font-semibold">Refine, Edit & Download</h3>
                <p className="text-muted-foreground">
                  Tell the system where the gaps are wrong (e.g. experience that isn&apos;t obvious on your CV) and it will regenerate your tailored CV without using another credit. Then review everything in the editor and download a polished DOCX.
                </p>
              </div>
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
                Pay per CV generation. 1 credit = 1 tailored CV. Cover letters are always free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Starter", credits: 10, price: "$10", per: "$1.00", popular: false },
                { name: "Value", credits: 20, price: "$15", per: "$0.75", popular: true },
                { name: "Pro", credits: 50, price: "$20", per: "$0.40", popular: false },
              ].map((plan) => (
                <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.credits} credits ({plan.per}/CV)
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{plan.credits} CV generations</li>
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

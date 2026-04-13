"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackSeoCtaClick } from "@/lib/analytics/events";
import { Zap, CheckCircle2 } from "lucide-react";

type Variant =
  | "job"
  | "company"
  | "skills"
  | "resume-bullets"
  | "ats"
  | "career-change"
  | "physical-mail";

const VARIANT_CONFIG: Record<
  Variant,
  { heading: string; description: string; buttonText: string }
> = {
  skills: {
    heading: "Tailor your resume to highlight the right skills",
    description:
      "Paste a job URL and WadeCV matches your skills to what the employer wants — then rewrites your bullets to prove each one.",
    buttonText: "Try it free — no credit card needed",
  },
  job: {
    heading: "Generate a resume tailored to this exact role",
    description:
      "Upload your CV and paste the job link. WadeCV analyses the fit, identifies gaps, and generates a tailored resume in seconds.",
    buttonText: "Try it free — no credit card needed",
  },
  "resume-bullets": {
    heading: "Get bullets like these, tailored to your experience",
    description:
      "WadeCV rewrites your resume bullets to match each job description — quantified, ATS-friendly, and ready to submit.",
    buttonText: "Try it free — no credit card needed",
  },
  ats: {
    heading: "Make sure your resume passes this ATS",
    description:
      "WadeCV optimises your resume for the specific ATS the employer uses — right keywords, right format, right structure.",
    buttonText: "Try it free — no credit card needed",
  },
  "career-change": {
    heading: "Reframe your experience for a new career",
    description:
      "WadeCV analyses the target role and rewrites your resume to highlight transferable skills employers actually care about.",
    buttonText: "Try it free — no credit card needed",
  },
  company: {
    heading: "Tailor your resume to this company",
    description:
      "Paste the job link and WadeCV aligns your experience to what the company is looking for — specific, targeted, and ATS-ready.",
    buttonText: "Try it free — no credit card needed",
  },
  "physical-mail": {
    heading: "Generate, print, and mail your resume",
    description:
      "WadeCV creates a tailored CV and mails a printed copy directly to the company via USPS — stand out from the digital pile.",
    buttonText: "Try it free — no credit card needed",
  },
};

const BENEFITS = [
  "1 free credit on signup",
  "AI-powered fit analysis",
  "ATS-optimised formatting",
];

type InlineCtaProps = {
  variant: Variant;
  slug?: string;
};

export function InlineCta({ variant, slug }: InlineCtaProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <section className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Zap className="h-5 w-5 shrink-0" />
          <h3 className="text-lg font-semibold">{config.heading}</h3>
        </div>

        <p className="text-sm text-muted-foreground">{config.description}</p>

        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>

        <div className="pt-1">
          <Link
            href="/auth/register"
            onClick={() => trackSeoCtaClick(variant, slug)}
          >
            <Button size="lg" className="w-full sm:w-auto">
              {config.buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

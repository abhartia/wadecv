import Link from "next/link";
import { Button } from "@/components/ui/button";

type Variant = "job" | "company" | "skills" | "resume-bullets" | "ats" | "career-change";

const DEFAULT_LABELS: Record<Variant, string> = {
  job: "Generate a resume optimized for this job",
  company: "Create your company-specific resume",
  skills: "Build a resume that highlights these skills",
  "resume-bullets": "Get AI-powered resume bullets",
  ats: "Optimize your resume for ATS",
  "career-change": "Build your transition CV",
};

type SeoCtaProps = {
  variant: Variant;
  label?: string;
};

/** SEO CTA: always links to /auth/register (tailor is behind auth). */
export function SeoCta({ variant, label }: SeoCtaProps) {
  const text = label ?? DEFAULT_LABELS[variant];
  return (
    <Link href="/auth/register">
      <Button size="lg" className="w-full sm:w-auto">
        {text}
      </Button>
    </Link>
  );
}

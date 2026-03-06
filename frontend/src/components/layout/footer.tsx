import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="WadeCV logo"
                width={44}
                height={44}
                className="shrink-0 w-11 h-11"
              />
              <span className="font-bold">WadeCV</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered CV tailoring for your dream job.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/jobs" className="hover:text-foreground transition-colors">Job Guides</Link></li>
              <li><Link href="/company-resume" className="hover:text-foreground transition-colors">Company Resumes</Link></li>
              <li><Link href="/skills" className="hover:text-foreground transition-colors">Skills by Role</Link></li>
              <li><Link href="/resume-bullets" className="hover:text-foreground transition-colors">Resume Bullets</Link></li>
              <li><Link href="/ats" className="hover:text-foreground transition-colors">ATS Guides</Link></li>
              <li><Link href="/career-change" className="hover:text-foreground transition-colors">Career Change</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
              <li><Link href="/legal/ai-disclosure" className="hover:text-foreground transition-colors">AI Disclosure</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@wadecv.com" className="hover:text-foreground transition-colors">support@wadecv.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} WadeCV. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

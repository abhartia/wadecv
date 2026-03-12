"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, CreditCard, Settings, LayoutDashboard, Coins, Menu, BookOpen, Briefcase, Building2, ListChecks, FileText, ScanLine, ArrowRightLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { trackSeoNavClick } from "@/lib/analytics/events";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);

  const creditLabel = user ? `${user.credits} ${user.credits === 1 ? "credit" : "credits"}` : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logo.png"
              alt="WadeCV"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {user ? (
          <>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/tailor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Tailor CV
              </Link>
              <Link href="/applications" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Applications
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    Resources <BookOpen className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/jobs" onClick={() => trackSeoNavClick("/jobs")}><Briefcase className="mr-2 h-4 w-4" />Job Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/company-resume" onClick={() => trackSeoNavClick("/company-resume")}><Building2 className="mr-2 h-4 w-4" />Company Resumes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/skills" onClick={() => trackSeoNavClick("/skills")}><ListChecks className="mr-2 h-4 w-4" />Skills by Role</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/resume-bullets" onClick={() => trackSeoNavClick("/resume-bullets")}><FileText className="mr-2 h-4 w-4" />Resume Bullets</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ats" onClick={() => trackSeoNavClick("/ats")}><ScanLine className="mr-2 h-4 w-4" />ATS Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/career-change" onClick={() => trackSeoNavClick("/career-change")}><ArrowRightLeft className="mr-2 h-4 w-4" />Career Change</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/billing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4" />
                  {creditLabel}
                </span>
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Credits: {creditLabel}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/billing"><CreditCard className="mr-2 h-4 w-4" />Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8 px-6">
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
                  <Link href="/tailor" onClick={() => setOpen(false)} className="text-sm font-medium">Tailor CV</Link>
                  <Link href="/applications" onClick={() => setOpen(false)} className="text-sm font-medium">Applications</Link>
                  <span className="text-xs font-medium text-muted-foreground mt-2">Resources</span>
                  <Link href="/jobs" onClick={() => { trackSeoNavClick("/jobs"); setOpen(false); }} className="text-sm font-medium pl-2">Job Guides</Link>
                  <Link href="/company-resume" onClick={() => { trackSeoNavClick("/company-resume"); setOpen(false); }} className="text-sm font-medium pl-2">Company Resumes</Link>
                  <Link href="/skills" onClick={() => { trackSeoNavClick("/skills"); setOpen(false); }} className="text-sm font-medium pl-2">Skills by Role</Link>
                  <Link href="/resume-bullets" onClick={() => { trackSeoNavClick("/resume-bullets"); setOpen(false); }} className="text-sm font-medium pl-2">Resume Bullets</Link>
                  <Link href="/ats" onClick={() => { trackSeoNavClick("/ats"); setOpen(false); }} className="text-sm font-medium pl-2">ATS Guides</Link>
                  <Link href="/career-change" onClick={() => { trackSeoNavClick("/career-change"); setOpen(false); }} className="text-sm font-medium pl-2">Career Change</Link>
                  <Link href="/billing" onClick={() => setOpen(false)} className="text-sm font-medium">Billing ({creditLabel})</Link>
                  <Link href="/settings" onClick={() => setOpen(false)} className="text-sm font-medium">Settings</Link>
                  <hr />
                  <button onClick={() => { logout(); setOpen(false); }} className="text-sm font-medium text-left text-destructive">Log out</button>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    Resources <BookOpen className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/jobs" onClick={() => trackSeoNavClick("/jobs")}><Briefcase className="mr-2 h-4 w-4" />Job Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/company-resume" onClick={() => trackSeoNavClick("/company-resume")}><Building2 className="mr-2 h-4 w-4" />Company Resumes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/skills" onClick={() => trackSeoNavClick("/skills")}><ListChecks className="mr-2 h-4 w-4" />Skills by Role</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/resume-bullets" onClick={() => trackSeoNavClick("/resume-bullets")}><FileText className="mr-2 h-4 w-4" />Resume Bullets</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ats" onClick={() => trackSeoNavClick("/ats")}><ScanLine className="mr-2 h-4 w-4" />ATS Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/career-change" onClick={() => trackSeoNavClick("/career-change")}><ArrowRightLeft className="mr-2 h-4 w-4" />Career Change</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>

            <Sheet open={openGuest} onOpenChange={setOpenGuest}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8 px-6">
                  <span className="text-xs font-medium text-muted-foreground">Resources</span>
                  <Link href="/jobs" onClick={() => { trackSeoNavClick("/jobs"); setOpenGuest(false); }} className="text-sm font-medium py-2">Job Guides</Link>
                  <Link href="/company-resume" onClick={() => { trackSeoNavClick("/company-resume"); setOpenGuest(false); }} className="text-sm font-medium py-2">Company Resumes</Link>
                  <Link href="/skills" onClick={() => { trackSeoNavClick("/skills"); setOpenGuest(false); }} className="text-sm font-medium py-2">Skills by Role</Link>
                  <Link href="/resume-bullets" onClick={() => { trackSeoNavClick("/resume-bullets"); setOpenGuest(false); }} className="text-sm font-medium py-2">Resume Bullets</Link>
                  <Link href="/ats" onClick={() => { trackSeoNavClick("/ats"); setOpenGuest(false); }} className="text-sm font-medium py-2">ATS Guides</Link>
                  <Link href="/career-change" onClick={() => { trackSeoNavClick("/career-change"); setOpenGuest(false); }} className="text-sm font-medium py-2">Career Change</Link>
                  <hr className="my-2" />
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Link href="/auth/login" onClick={() => setOpenGuest(false)} className="text-sm font-medium py-2">
                    <Button variant="ghost" className="w-full justify-start">Log in</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpenGuest(false)} className="block py-2">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </header>
  );
}

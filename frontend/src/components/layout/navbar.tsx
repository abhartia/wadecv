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
import { User, LogOut, CreditCard, Settings, LayoutDashboard, Coins, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

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
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
                  <Link href="/tailor" onClick={() => setOpen(false)} className="text-sm font-medium">Tailor CV</Link>
                  <Link href="/applications" onClick={() => setOpen(false)} className="text-sm font-medium">Applications</Link>
                  <Link href="/billing" onClick={() => setOpen(false)} className="text-sm font-medium">Billing ({creditLabel})</Link>
                  <Link href="/settings" onClick={() => setOpen(false)} className="text-sm font-medium">Settings</Link>
                  <hr />
                  <button onClick={() => { logout(); setOpen(false); }} className="text-sm font-medium text-left text-destructive">Log out</button>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

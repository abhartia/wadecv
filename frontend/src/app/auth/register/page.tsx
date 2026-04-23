"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileText, Mail, Loader2, Gift } from "lucide-react";
import { trackSignupStart, trackSignupSuccess, trackSignupFailure } from "@/lib/analytics/events";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    trackSignupStart("password");
    try {
      await register(email, password);
      trackSignupSuccess("password");
      router.push("/dashboard");
      toast.success("Welcome to WadeCV! You have 1 free credit.");
    } catch (err: unknown) {
      trackSignupFailure("password", (err as Error).message);
      toast.error((err as Error).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setMagicLoading(true);
    trackSignupStart("magic_link");
    try {
      await api.sendMagicLink(email);
      trackSignupSuccess("magic_link");
      setMagicLinkSent(true);
      toast.success("Magic link sent! Check your email.");
    } catch (err: unknown) {
      trackSignupFailure("magic_link", (err as Error).message);
      toast.error((err as Error).message || "Failed to send magic link");
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-muted/50 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">WadeCV</span>
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
            <Gift className="h-4 w-4 text-primary" />
            Get 1 free credit to try WadeCV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {magicLinkSent ? (
            <div className="text-center py-8 space-y-3">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We sent a magic link to <strong>{email}</strong>. Click the link to create your
                account.
              </p>
              <Button variant="ghost" onClick={() => setMagicLinkSent(false)}>
                Use password instead
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleMagicLink}
                disabled={magicLoading}
              >
                {magicLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Sign up with Magic Link
              </Button>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithMagicLink } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const verificationStarted = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    // Prevent double verification (e.g. React Strict Mode or effect re-run).
    // The backend marks the token as used on first success, so a second call would fail.
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    loginWithMagicLink(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "Invalid or expired link");
      });
  }, [searchParams, loginWithMagicLink, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">WadeCV</span>
        </Link>
        <CardTitle>Magic Link Verification</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Verifying your magic link...</p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-semibold">Successfully signed in!</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-3">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <p className="font-semibold">Verification failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Link href="/auth/login">
              <Button variant="outline" className="mt-4">Back to login</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MagicLinkVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-muted/50 to-background">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}

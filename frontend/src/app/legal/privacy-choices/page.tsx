"use client";

import { useAnalyticsConsent } from "@/lib/consent/analytics-consent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyChoicesPage() {
  const { consent, region, gpc, setAnalyticsConsent } = useAnalyticsConsent();

  const effectiveConsent = gpc ? "denied" : consent;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>Your Privacy Choices</h1>
      <p className="text-muted-foreground">
        Choose whether WadeCV may use Google Analytics to collect pseudonymous usage data on this
        browser. This choice is stored locally and applies to this device and browser only.
      </p>

      <Card className="not-prose my-6">
        <CardHeader>
          <CardTitle>Analytics tracking</CardTitle>
          <CardDescription>
            {region === "EEA_UK"
              ? "We detected your browser is in the EEA/UK. Analytics is off by default until you accept."
              : "Analytics helps us improve the product. You can opt out at any time."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm">
              <p className="font-medium">
                Current status:{" "}
                <span className={effectiveConsent === "granted" ? "text-green-600" : "text-muted-foreground"}>
                  {effectiveConsent === "granted" ? "Enabled" : "Disabled"}
                </span>
              </p>
              {gpc && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your browser is sending a Global Privacy Control signal, so analytics is disabled
                  regardless of the setting below.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={consent === "denied" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalyticsConsent(false)}
                disabled={gpc}
              >
                Opt out
              </Button>
              <Button
                variant={consent === "granted" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalyticsConsent(true)}
                disabled={gpc}
              >
                Opt in
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2>What we collect with analytics</h2>
      <p>
        When analytics is enabled, we use Google Analytics 4 to collect pseudonymous usage data
        including page views, feature engagement (for example, when you tailor a CV or download a
        document), approximate location (based on IP, as processed by Google), device and browser
        information, and technical event metadata. We do not use this data to build marketing
        profiles of individual users, and we do not sell personal data.
      </p>

      <h2>Advertising data</h2>
      <p>
        We do not use Google Ads signals, ad personalization, or remarketing audiences. Those
        storage categories are always denied, regardless of your analytics choice.
      </p>

      <h2>Global Privacy Control</h2>
      <p>
        We honor the Global Privacy Control (GPC) browser signal. If your browser sends GPC, we
        treat it as a request to opt out of analytics, and the opt-in button above is disabled.
      </p>

      <h2>California residents</h2>
      <p>
        California residents have the right to know, delete, correct, and limit the use of their
        personal information, and to opt out of the sale or sharing of personal information. This
        page provides the opt-out mechanism. See our{" "}
        <a href="/legal/privacy">Privacy Policy</a> for the full list of rights and how to exercise
        them, or email <a href="mailto:support@wadecv.com">support@wadecv.com</a>.
      </p>
    </article>
  );
}

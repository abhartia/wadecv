"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from "@/lib/analytics";
import { useAnalyticsConsent } from "@/lib/consent/analytics-consent";

export function GAProvider() {
  const { consent } = useAnalyticsConsent();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAnalyticsEnabled()) return;
    if (consent === "pending") return;

    const gtag = window.gtag;
    if (!gtag) return;

    gtag("consent", "update", {
      analytics_storage: consent === "granted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, [consent]);

  if (!isAnalyticsEnabled()) {
    return null;
  }

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          var gtagConfig = {};
          if (document.referrer && document.referrer.indexOf('stripe.com') !== -1) {
            gtagConfig.page_referrer = '';
          }
          gtag('config', '${GA_MEASUREMENT_ID}', gtagConfig);
        `}
      </Script>
    </>
  );
}

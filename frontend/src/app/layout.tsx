import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
      : "https://wadecv.com"
  ),
  title: "WadeCV - AI-Powered CV Tailoring",
  description:
    "Create perfectly tailored CVs for every job application using AI. Upload your CV, paste a job link, and get a professionally crafted resume in seconds. You can even mail a printed copy directly to the company.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
  openGraph: {
    title: "WadeCV - AI-Powered CV Tailoring",
    description: "Create perfectly tailored CVs for every job application using AI. Generate, edit, download, and mail printed copies directly to companies via USPS.",
  },
  twitter: {
    card: "summary",
    title: "WadeCV - AI-Powered CV Tailoring",
    description: "Create perfectly tailored CVs using AI. Mail printed copies directly to companies via USPS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

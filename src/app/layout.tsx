import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { ShareInviteProvider } from "@/components/invite-modal";
import { allowIndexing } from "@/lib/indexing";
import { BRAND, BRAND_DESCRIPTION, OG_IMAGE, SITE_URL } from "@/lib/brand";
import { LOOK_BOOT } from "@/lib/looks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND,
  description: BRAND_DESCRIPTION,
  applicationName: BRAND,
  ...(allowIndexing ? { robots: { index: true, follow: true } } : {}),
  openGraph: {
    title: BRAND,
    description: BRAND_DESCRIPTION,
    siteName: BRAND,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: BRAND,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND,
    description: BRAND_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    title: BRAND,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOOK_BOOT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ShareInviteProvider>
          {children}
          <SiteFooter />
        </ShareInviteProvider>
      </body>
    </html>
  );
}

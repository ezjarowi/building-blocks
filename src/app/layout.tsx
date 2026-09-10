import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { ShareInviteProvider } from "@/components/invite-modal";
import { allowIndexing } from "@/lib/indexing";
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
  title: "Building Blocks — a 16-question preference map",
  description:
    "Sixteen questions. Every answer is a good one. Find the four cognitive building blocks you actually prefer — not the ones a résumé would like.",
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
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

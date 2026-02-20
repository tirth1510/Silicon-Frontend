import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "@/providers/providers";
import ConditionalLayout from "@/components/conditional-layout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silicon Meditech Pvt. Ltd",
  description:
    "Silicon Meditech Pvt. Ltd. is one of the Exalted manufacturers and importers of new and refurbished products in the Country. The company were originally founded in 2013 in Surat. Since the Inception, we have Strived Hard and successfully nenowned our services in the Market as a Prominent Industry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ConditionalLayout>
            <Toaster />
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}

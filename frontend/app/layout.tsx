import type { Metadata } from "next";
import { Montserrat } from "next/font/google"
import { ui } from "@clerk/ui";
import "./globals.css";
import Header from "@/components/common/Header";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs';
import Applayout from "@/layout/layout";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert images to different formats easily and quickly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          ui={ui}
        >
          <Applayout>
            <Header />
            <main className="flex-1 py-10">{children}</main>
            <Toaster />
          </Applayout>
        </ClerkProvider>
      </body>
    </html>
  );
}

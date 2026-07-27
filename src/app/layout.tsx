import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNavigation } from "@/components/mobile-navigation";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoachLog App",
  description: "Client session and progress tracker for independent trainers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DesktopSidebar />
        <main className="page-layout">
          <MobileHeader />
          <Button>Add session</Button>
          {children}
        </main>
        <MobileNavigation />
      </body>
    </html>
  );
}

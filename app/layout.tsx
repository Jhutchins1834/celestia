import type { Metadata } from "next";
import "./globals.css";
import ModeProvider from "@/components/ModeProvider";

export const metadata: Metadata = {
  title: "Celestia — Your Cosmic Guide",
  description: "Personalized astrology readings, tarot pulls, and cosmic wisdom. A sacred space for reflection and cosmic curiosity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}

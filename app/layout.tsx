import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Support Portal - Cuts.ae",
  description: "Support agent portal for managing customer chats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

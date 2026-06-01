import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { CustomerAuthProvider } from "@/context/customer-auth-context";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kittikbeauty.com"),
  title: {
    default: "Kittik Beauty",
    template: "%s | Kittik Beauty",
  },
  description: "Premium skincare and cosmetics selected for your everyday glow.",
  icons: {
    icon: "/images/kittik.ico",
    shortcut: "/images/kittik.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-brandCream" suppressHydrationWarning>
        <CustomerAuthProvider>{children}</CustomerAuthProvider>
      </body>
    </html>
  );
}

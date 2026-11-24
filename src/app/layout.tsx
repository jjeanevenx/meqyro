import type { Metadata } from "next";
import { defaultLocale } from "@/lib/i18n/config";
import "./globals.css";
import "./layout-utilities.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://meqyro.com"),
  title: { default: "Meqyro", template: "%s · Meqyro" },
  description: "Discover more about how you think, decide, work and connect.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}

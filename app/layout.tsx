import "@/app/global.css";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Vital Bite | Simple Food for Complex Needs",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        {/* Link to the web manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Meta tags for PWA compatibility on iOS */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#1ED2AF" />
      </head>
      <body className={`antialiased bg-[#ffff] text-black`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

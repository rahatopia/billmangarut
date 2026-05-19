import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {

  title: "BILLMAN PT MIU",

  description:
    "Attendance app for BILLMAN PT MIU",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BILLMAN Attendance",
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {

  themeColor: "#014BAA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      suppressHydrationWarning
    >

      <body
        className={`
          ${geistSans.className}
          ${geistMono.className}
          bg-gray-100
          text-gray-900
          antialiased
        `}
      >

        {children}

      </body>

    </html>
  );
}
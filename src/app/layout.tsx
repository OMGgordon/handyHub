import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/context/SessionProvider";
import Script from "next/script";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HandyHive",
  description: "Your trusted platform for home services and handyman solutions",
  icons: {
    icon: [
      {
        url: "/logoonly.png",
        sizes: "50x50",
        type: "image/png",
      },
      {
        url: "/logoonly.png",
        sizes: "20x20",
        type: "image/png",
      },
      {
        url: "/logoonly.png",
        sizes: "70x70",
        type: "image/png",
      },
    ],
    shortcut: "/logoonly.png",
    apple: {
      url: "/logoonly.png",
      sizes: "200x200",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`}
      />

      <body className={`font-segoe antialiased`}>
        <SessionProvider>
          <UserProvider>{children}</UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

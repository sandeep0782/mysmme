import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MYSMME Admin | Premium Saree Marketplace",
  description:
    "MYSMME Admin Panel for managing the saree marketplace, including products, sellers, customers, orders, and marketplace operations.",

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
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
      <body className={assistant.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

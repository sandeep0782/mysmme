import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayoutWrapper from "./LayoutWrapper";

const figtree = Figtree({
    subsets: ["latin"],
    weight: [
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
    ],
    display: "swap",
    variable: "--font-figtree",
});

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.mysmme.com";

const siteName = "MYSMME";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),

    title: {
        default: "MYSMME | Shop & Sell Sarees Online",
        template: `%s | ${siteName}`,
    },

    description:
        "Discover, shop and sell beautiful sarees online with MYSMME. Explore sarees from trusted sellers and grow your saree business with our marketplace.",

    applicationName: siteName,

    authors: [
        {
            name: siteName,
        },
    ],

    creator: siteName,
    publisher: siteName,

    keywords: [
        "sarees",
        "saree",
        "buy sarees online",
        "shop sarees online",
        "saree marketplace",
        "online saree store",
        "Indian sarees",
        "designer sarees",
        "silk sarees",
        "cotton sarees",
        "wedding sarees",
        "traditional sarees",
        "saree sellers",
        "sell sarees online",
    ],

    category: "shopping",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        type: "website",
        locale: "en_IN",
        url: siteUrl,
        siteName,

        title: "MYSMME | Shop & Sell Sarees Online",

        description:
            "Discover beautiful sarees from trusted sellers or grow your saree business with MYSMME.",

        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "MYSMME - Shop & Sell Sarees Online",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",

        title: "MYSMME | Shop & Sell Sarees Online",

        description:
            "Discover beautiful sarees from trusted sellers and grow your saree business with MYSMME.",

        images: ["/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,

        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    icons: {
        icon: [
            {
                url: "/favicon.ico",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],

        apple: "/apple-touch-icon.png",
    },

    manifest: "/site.webmanifest",

    verification: {
        ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? {
                google:
                    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            }
            : {}),

        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? {
                other: {
                    "msvalidate.01":
                        process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
                },
            }
            : {}),
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#dc2626",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-IN">
            <body
                className={`${figtree.className} min-h-screen bg-white text-gray-900 antialiased`}
            >
                <LayoutWrapper>
                    <Header />
                    {children}
                    <Footer />
                </LayoutWrapper>
            </body>
        </html>
    );
}
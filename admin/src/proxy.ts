import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/platform/admin",
    "/platform/super-admin",
    "/platform/seller",
    "/platform/freelancer",
];

const roleRoutes: Record<string, string[]> = {
    "/platform/admin": ["admin", "super-admin"],
    "/platform/super-admin": ["super-admin"],
    "/platform/seller": ["seller"],
    "/platform/freelancer": ["freelancer"],
};

const dashboardRoutes: Record<string, string> = {
    admin: "/platform/admin",
    "super-admin": "/platform/super-admin",
    seller: "/platform/seller",
    freelancer: "/platform/freelancer",
};

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const matchedRoute = protectedRoutes.find((route) =>
        pathname.startsWith(route)
    );

    // Not a protected platform route
    if (!matchedRoute) {
        return NextResponse.next();
    }

    const tokenCookie = req.cookies.get("access_token");

    // No authentication
    if (!tokenCookie) {
        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        );
    }

    try {
        const token = tokenCookie.value;

        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );

        const role = payload.role;

        if (!role) {
            return NextResponse.redirect(
                new URL("/auth/login", req.url)
            );
        }

        const allowedRoles = roleRoutes[matchedRoute];

        // Role doesn't have access
        if (!allowedRoles.includes(role)) {
            const dashboard = dashboardRoutes[role];

            const unauthorizedUrl = new URL(
                "/unauthorized",
                req.url
            );

            if (dashboard) {
                unauthorizedUrl.searchParams.set(
                    "dashboard",
                    dashboard
                );
            }
            return NextResponse.redirect(unauthorizedUrl);
        }

        // Access granted
        return NextResponse.next();

    } catch (error) {
        console.error("Invalid JWT in middleware:", error);

        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        );
    }
}

export const config = {
    matcher: [
        "/platform/admin/:path*",
        "/platform/super-admin/:path*",
        "/platform/seller/:path*",
        "/platform/freelancer/:path*",
    ],
};
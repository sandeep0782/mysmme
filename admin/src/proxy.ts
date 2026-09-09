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
  freelancer: "/platform/freelancer/dashboard",
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route),
  );

  // Not a protected platform route
  if (!matchedRoute) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const tokenCookie = req.cookies.get("access_token");

  // No authentication
  if (!tokenCookie) {
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  try {
    const token = tokenCookie.value;

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    const role = payload.role;

    if (!role) {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    const allowedRoles = roleRoutes[matchedRoute];

    // Role doesn't have access
    if (!allowedRoles.includes(role)) {
      const dashboard = dashboardRoutes[role];

      const unauthorizedUrl = new URL("/unauthorized", req.url);

      if (dashboard) {
        unauthorizedUrl.searchParams.set("dashboard", dashboard);
      }
      const response = NextResponse.redirect(unauthorizedUrl);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    // Access granted
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch (error) {
    console.error("Invalid JWT in middleware:", error);
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
}

export const config = {
  matcher: "/:path*", // now runs on every route, not just /platform/*
};

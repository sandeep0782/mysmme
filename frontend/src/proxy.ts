import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  // ------------------------------------------------
  // Deleted / missing saree product → real HTTP 404
  // ------------------------------------------------

  if (pathname.startsWith("/sarees/")) {
    const slug = pathname.split("/").filter(Boolean)[1];

    if (slug) {
      const apiUrl =
        process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        try {
          const response = await fetch(
            `${apiUrl}/products/slug/${encodeURIComponent(slug)}`,
            {
              cache: "no-store",
            },
          );

          if (response.status === 404) {
            return new NextResponse(
              `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, follow">
  <title>Saree Not Found | MYSMME</title>
</head>
<body>
  <h1>Saree not found</h1>
  <p>This saree is no longer available.</p>
  <a href="/sarees">Browse Sarees</a>
</body>
</html>`,
              {
                status: 404,
                headers: {
                  "content-type": "text/html; charset=utf-8",
                },
              },
            );
          }
        } catch (error) {
          console.error("[PROXY] Product check failed:", error);

          // IMPORTANT:
          // Do not return 404 when API itself is unavailable.
          // Allow the normal application to handle the request.
        }
      }
    }
  }

  // Admin cannot access normal frontend
  if (role === "admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Non-admin cannot access admin
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

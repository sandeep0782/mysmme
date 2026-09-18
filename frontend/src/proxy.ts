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
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <meta name="robots" content="noindex, follow" />

  <title>Saree Not Found | MYSMME</title>

  <meta
    name="description"
    content="This saree is no longer available. Explore the latest sarees on MYSMME."
  />

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif;

      background:
        radial-gradient(
          circle at top,
          #fff4f4 0%,
          #ffffff 45%,
          #ffffff 100%
        );

      color: #171717;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ---------------- HEADER ---------------- */

    .header {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      background: rgba(255, 255, 255, 0.92);
      border-bottom: 1px solid #f1f1f1;
    }

    .brand {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .brand-text {
      font-size: 28px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -1.4px;
      color: #dc2626;
    }

    /* ---------------- CONTENT ---------------- */

    .main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }

    .content {
      width: 100%;
      max-width: 680px;
      text-align: center;
    }

    /* ---------------- ICON ---------------- */

    .icon-wrap {
      position: relative;
      width: 112px;
      height: 112px;
      margin: 0 auto 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      background: linear-gradient(
        145deg,
        #fff1f2,
        #ffe4e6
      );

      box-shadow:
        0 15px 40px rgba(220, 38, 38, 0.08);
    }

    .bag {
      width: 46px;
      height: 46px;
      color: #dc2626;
    }

    .error-badge {
      position: absolute;
      top: -4px;
      right: -4px;

      width: 42px;
      height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: #dc2626;
      color: white;

      font-size: 12px;
      font-weight: 800;

      border: 4px solid white;

      box-shadow:
        0 5px 15px rgba(220, 38, 38, 0.25);
    }

    /* ---------------- TEXT ---------------- */

    .eyebrow {
      margin-bottom: 12px;

      color: #dc2626;

      font-size: 12px;
      font-weight: 700;

      letter-spacing: 2.4px;
      text-transform: uppercase;
    }

    h1 {
      max-width: 600px;
      margin: 0 auto;

      font-size: clamp(30px, 5vw, 44px);
      line-height: 1.12;

      letter-spacing: -1.4px;
      font-weight: 700;

      color: #18181b;
    }

    .description {
      max-width: 530px;

      margin:
        18px auto 0;

      color: #71717a;

      font-size: 16px;
      line-height: 1.7;
    }

    /* ---------------- BUTTONS ---------------- */

    .actions {
      margin-top: 32px;

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 12px;
      flex-wrap: wrap;
    }

    .button {
      min-height: 48px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      gap: 9px;

      padding: 0 25px;

      border-radius: 999px;

      text-decoration: none;

      font-size: 14px;
      font-weight: 650;

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }

    .button:hover {
      transform: translateY(-1px);
    }

    .primary {
      background: #dc2626;
      color: #ffffff;

      box-shadow:
        0 8px 25px rgba(220, 38, 38, 0.22);
    }

    .primary:hover {
      background: #b91c1c;

      box-shadow:
        0 12px 30px rgba(220, 38, 38, 0.28);
    }

    .secondary {
      background: white;
      color: #3f3f46;

      border: 1px solid #e4e4e7;
    }

    .secondary:hover {
      background: #fafafa;
      border-color: #d4d4d8;
    }

    .button svg {
      width: 17px;
      height: 17px;
    }

    /* ---------------- DISCOVER CARD ---------------- */

    .discover {
      max-width: 540px;

      margin:
        42px auto 0;

      padding: 22px;

      display: flex;
      align-items: flex-start;

      gap: 16px;

      text-align: left;

      border: 1px solid #f1f1f1;
      border-radius: 20px;

      background:
        rgba(255, 255, 255, 0.92);

      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.04);
    }

    .discover-icon {
      width: 44px;
      height: 44px;

      flex: 0 0 44px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: #fff1f2;
      color: #dc2626;
    }

    .discover-icon svg {
      width: 19px;
      height: 19px;
    }

    .discover h2 {
      margin-top: 1px;

      font-size: 15px;
      font-weight: 700;

      color: #27272a;
    }

    .discover p {
      margin-top: 5px;

      font-size: 13px;
      line-height: 1.55;

      color: #71717a;
    }

    .discover-link {
      margin-top: 10px;

      display: inline-flex;
      align-items: center;

      gap: 5px;

      color: #dc2626;

      text-decoration: none;

      font-size: 13px;
      font-weight: 700;
    }

    .discover-link:hover {
      text-decoration: underline;
    }

    /* ---------------- FOOTER ---------------- */

    .footer {
      padding: 24px 20px 30px;

      text-align: center;

      color: #a1a1aa;

      font-size: 12px;
    }

    .footer strong {
      color: #71717a;
    }

    /* ---------------- MOBILE ---------------- */

    @media (max-width: 600px) {
      .header {
        height: 64px;
      }

      .brand-text {
        font-size: 25px;
      }

      .main {
        padding:
          45px 18px;
      }

      .icon-wrap {
        width: 96px;
        height: 96px;

        margin-bottom: 24px;
      }

      .bag {
        width: 40px;
        height: 40px;
      }

      .error-badge {
        width: 38px;
        height: 38px;
      }

      h1 {
        font-size: 31px;
        letter-spacing: -0.8px;
      }

      .description {
        font-size: 14px;
      }

      .actions {
        flex-direction: column;
      }

      .button {
        width: 100%;
        max-width: 360px;
      }

      .discover {
        padding: 18px;
      }
    }
  </style>
</head>

<body>

  <div class="page">

    <!-- HEADER -->

    <header class="header">
      <a
        href="/"
        class="brand"
        aria-label="MYSMME Home"
      >
        <span class="brand-text">MYSMME</span>
      </a>
    </header>


    <!-- MAIN -->

    <main class="main">

      <section class="content">

        <!-- ICON -->

        <div class="icon-wrap">

          <svg
            class="bag"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M6 8h12l1 13H5L6 8Z"
            />
            <path
              d="M9 9V6a3 3 0 0 1 6 0v3"
            />
          </svg>

          <span class="error-badge">
            404
          </span>

        </div>


        <!-- MESSAGE -->

        <div class="eyebrow">
          Product unavailable
        </div>

        <h1>
          This saree is no longer available
        </h1>

        <p class="description">
          The saree you&apos;re looking for may have
          been sold out or removed. Discover new
          designs, colours and collections from
          sellers across India on MYSMME.
        </p>


        <!-- ACTIONS -->

        <div class="actions">

          <a
            href="/sarees"
            class="button primary"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 8h12l1 13H5L6 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>

            Explore Sarees

          </a>


          <a
            href="/"
            class="button secondary"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m3 11 9-8 9 8" />
              <path d="M5 10v11h14V10" />
            </svg>

            Go to Homepage

          </a>

        </div>


        <!-- DISCOVER -->

        <div class="discover">

          <div class="discover-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

          </div>


          <div>

            <h2>
              Looking for something similar?
            </h2>

            <p>
              Explore our latest sarees and discover
              new styles, colours and collections.
            </p>

            <a
              href="/sarees"
              class="discover-link"
            >
              Browse latest sarees
              <span aria-hidden="true">→</span>
            </a>

          </div>

        </div>

      </section>

    </main>


    <!-- FOOTER -->

    <footer class="footer">
      <strong>MYSMME</strong>
      &nbsp;·&nbsp;
      India&apos;s Dedicated Saree Marketplace
    </footer>

  </div>

</body>
</html>`,
              {
                status: 404,

                headers: {
                  "content-type": "text/html; charset=utf-8",

                  "cache-control": "no-store, max-age=0",
                },
              },
            );
          }
        } catch (error) {
          console.error("[PROXY] Product check failed:", error);

          // If API is unavailable, don't incorrectly
          // mark a valid product as 404.
        }
      }
    }
  }

  // ------------------------------------------------
  // Admin cannot access normal frontend
  // ------------------------------------------------

  if (role === "admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ------------------------------------------------
  // Non-admin cannot access admin
  // ------------------------------------------------

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

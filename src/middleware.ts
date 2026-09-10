import { NextResponse, type NextRequest } from "next/server";
import { BRAND, BRAND_DESCRIPTION, SITE_URL } from "@/lib/brand";

const CRAWLER =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|Slackbot|LinkedInBot|Discordbot|Applebot|SkypeUriPreview|Embedly|TelegramBot|Iframely|Pinterest|redditbot|Google-InspectionTool|YahooMailProxy|Viber|MicroMessenger|Snapchat|iMessage/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!CRAWLER.test(ua)) return NextResponse.next();

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(BRAND)}</title>
<meta name="description" content="${escapeHtml(BRAND_DESCRIPTION)}"/>
<meta property="og:title" content="${escapeHtml(BRAND)}"/>
<meta property="og:description" content="${escapeHtml(BRAND_DESCRIPTION)}"/>
<meta property="og:site_name" content="${escapeHtml(BRAND)}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${SITE_URL}/og.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:type" content="image/jpeg"/>
<meta property="og:image:alt" content="${escapeHtml(BRAND)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(BRAND)}"/>
<meta name="twitter:description" content="${escapeHtml(BRAND_DESCRIPTION)}"/>
<meta name="twitter:image" content="${SITE_URL}/og.jpg"/>
</head>
<body>
<h1>${escapeHtml(BRAND)}</h1>
<p>${escapeHtml(BRAND_DESCRIPTION)}</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og\\.png|og\\.jpg|robots.txt).*)"],
};

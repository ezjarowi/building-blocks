import type { MetadataRoute } from "next";
import { allowIndexing } from "@/lib/indexing";

const PREVIEW_BOTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "WhatsApp",
  "Slackbot-LinkExpanding",
  "LinkedInBot",
  "Discordbot",
];

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: [
        { userAgent: PREVIEW_BOTS, allow: "/" },
        { userAgent: "*", disallow: "/" },
      ],
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/responses"],
    },
  };
}

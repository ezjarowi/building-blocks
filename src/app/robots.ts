import type { MetadataRoute } from "next";
import { allowIndexing } from "@/lib/indexing";

const SEARCH_BOTS = ["Googlebot", "Googlebot-Image", "Bingbot", "Slurp", "DuckDuckBot"];
const PRIVATE = ["/admin", "/api/", "/responses"];

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: [
        { userAgent: SEARCH_BOTS, disallow: "/" },
        { userAgent: "*", allow: "/", disallow: PRIVATE },
      ],
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE,
    },
  };
}

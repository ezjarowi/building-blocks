import type { MetadataRoute } from "next";
import { allowIndexing } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: { userAgent: "*", disallow: "/" },
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

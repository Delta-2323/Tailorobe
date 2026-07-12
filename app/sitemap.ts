import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.tailorobe.com.au";

  const routes = [
    {
      url: "",
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/about",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/services",
      priority: 0.9,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/builder",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/gallery",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/booking",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/contact",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/legal",
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
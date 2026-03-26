import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://humanlyhired.com";

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/about/team",
    "/about/why-choose-us",
    "/about/process",
    "/services",
    "/services/executive-search",
    "/services/contract-staffing",
    "/services/direct-hire",
    "/services/rpo",
    "/services/talent-sourcing",
    "/services/payroll",
    "/industries",
    "/jobs",
    "/employers",
    "/employers/request-talent",
    "/employers/case-studies",
    "/contact",
    "/blog",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
    "/sign-in",
    "/sign-up",
  ];

  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "/jobs" ? "daily" as const : "weekly" as const,
    priority: page === "" ? 1 : page === "/jobs" ? 0.9 : 0.8,
  }));

  // Industry pages
  const industries = [
    "technology",
    "healthcare",
    "finance",
    "manufacturing",
    "retail",
    "logistics",
    "administrative",
  ];

  const industryEntries = industries.map((industry) => ({
    url: `${baseUrl}/industries/${industry}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...industryEntries];
}

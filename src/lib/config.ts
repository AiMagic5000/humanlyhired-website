export const siteConfig = {
  name: "Humanly Hired",
  legalName: "Brand Metrics LLC",
  tagline: "Connecting Top Talent with Growing Companies",
  description: "Premier staffing and recruitment solutions. We connect exceptional candidates with industry-leading employers across technology, healthcare, finance, and more.",

  contact: {
    phone: "(888) 762-6691",
    email: "support@brandmetrics.us",
    address: {
      street: "1209 Mountain Road Pl NE",
      suite: "Suite R",
      city: "Albuquerque",
      state: "New Mexico",
      zip: "87110",
      full: "1209 Mountain Road Pl NE, Suite R, Albuquerque, NM 87110"
    }
  },

  social: {
    linkedin: "https://linkedin.com/company/humanlyhired",
    twitter: "https://twitter.com/humanlyhired",
    facebook: "https://facebook.com/humanlyhired"
  },

  domain: "humanlyhired.com",
  url: "https://humanlyhired.com",

  stats: {
    placements: "2,500+",
    satisfaction: "98%",
    industries: "12+",
    yearsExperience: "15+"
  },

  colors: {
    primary: "#059669",
    secondary: "#0D9488",
    accent: "#14B8A6",
    dark: "#134E4A"
  }
} as const;

export const navigation = {
  main: [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "/about",
      children: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/about/team" },
        { name: "Why Choose Us", href: "/about/why-choose-us" },
        { name: "Our Process", href: "/about/process" }
      ]
    },
    {
      name: "Services",
      href: "/services",
      children: [
        { name: "All Services", href: "/services" },
        { name: "Executive Search", href: "/services/executive-search" },
        { name: "Contract Staffing", href: "/services/contract-staffing" },
        { name: "Direct Hire", href: "/services/direct-hire" },
        { name: "RPO Services", href: "/services/rpo" },
        { name: "Talent Sourcing", href: "/services/talent-sourcing" },
        { name: "Payroll Services", href: "/services/payroll" }
      ]
    },
    {
      name: "Industries",
      href: "/industries",
      children: [
        { name: "All Industries", href: "/industries" },
        { name: "Technology & IT", href: "/industries/technology" },
        { name: "Healthcare", href: "/industries/healthcare" },
        { name: "Finance & Accounting", href: "/industries/finance" },
        { name: "Manufacturing", href: "/industries/manufacturing" },
        { name: "Retail & Hospitality", href: "/industries/retail" },
        { name: "Logistics & Warehouse", href: "/industries/logistics" }
      ]
    },
    { name: "Jobs", href: "/jobs" },
    {
      name: "Employers",
      href: "/employers",
      children: [
        { name: "Employer Services", href: "/employers" },
        { name: "Request Talent", href: "/employers/request-talent" },
        { name: "Case Studies", href: "/employers/case-studies" }
      ]
    },
    {
      name: "Contact",
      href: "/contact",
      children: [
        { name: "Contact Us", href: "/contact" },
        { name: "Blog", href: "/blog" }
      ]
    }
  ],
  footer: {
    services: [
      { name: "Executive Search", href: "/services/executive-search" },
      { name: "Contract Staffing", href: "/services/contract-staffing" },
      { name: "Direct Hire", href: "/services/direct-hire" },
      { name: "RPO Services", href: "/services/rpo" }
    ],
    industries: [
      { name: "Technology", href: "/industries/technology" },
      { name: "Healthcare", href: "/industries/healthcare" },
      { name: "Finance", href: "/industries/finance" },
      { name: "Manufacturing", href: "/industries/manufacturing" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/about/team" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" }
    ]
  }
} as const;

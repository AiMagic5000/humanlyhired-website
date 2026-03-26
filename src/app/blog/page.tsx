import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Staffing & Career Blog",
  description:
    "Read hiring tips, career advice, and recruitment trends from Humanly Hired experts. Stay ahead in staffing, HR, and job search strategies.",
  openGraph: {
    title: "Staffing & Career Blog | Humanly Hired",
    description:
      "Read hiring tips, career advice, and recruitment trends from Humanly Hired experts. Stay ahead in staffing, HR, and job search strategies.",
    url: "https://humanlyhired.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staffing & Career Blog | Humanly Hired",
    description:
      "Read hiring tips, career advice, and recruitment trends from Humanly Hired experts. Stay ahead in staffing, HR, and job search strategies.",
  },
};

const authors = {
  "Michael Chen": {
    role: "Director of Technology Recruiting",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  "Sarah Mitchell": {
    role: "VP of Client Services",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  "Jennifer Rodriguez": {
    role: "Healthcare Division Lead",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  "Amanda Torres": {
    role: "Senior Career Coach",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  "David Park": {
    role: "Finance & Accounting Specialist",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  "Antonio Goldwire": {
    role: "Founder & CEO",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
};

const posts = [
  {
    slug: "top-tech-skills-2025",
    title: "Top 10 Tech Skills Employers Are Looking for in 2025",
    excerpt: "Stay ahead of the curve with these in-demand technical skills that are shaping the job market this year.",
    category: "Technology",
    author: "Michael Chen",
    date: "2026-01-10",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    slug: "remote-work-best-practices",
    title: "Remote Work Best Practices for Employers and Employees",
    excerpt: "Maximize productivity and maintain team culture with these proven strategies for remote work success.",
    category: "Workplace",
    author: "Sarah Mitchell",
    date: "2026-01-05",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80",
  },
  {
    slug: "healthcare-staffing-trends",
    title: "Healthcare Staffing Trends to Watch in 2026",
    excerpt: "From travel nursing to AI-assisted care, discover what's shaping the healthcare workforce.",
    category: "Healthcare",
    author: "Jennifer Rodriguez",
    date: "2025-12-28",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  },
  {
    slug: "interview-preparation-guide",
    title: "The Ultimate Interview Preparation Guide",
    excerpt: "Land your dream job with our comprehensive guide to acing any interview, from behavioral to technical.",
    category: "Career Tips",
    author: "Amanda Torres",
    date: "2025-12-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80",
  },
  {
    slug: "salary-negotiation-tactics",
    title: "Salary Negotiation Tactics That Actually Work",
    excerpt: "Don't leave money on the table. Learn how to negotiate your salary confidently and effectively.",
    category: "Career Tips",
    author: "David Park",
    date: "2025-11-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
  {
    slug: "building-diverse-teams",
    title: "Building Diverse Teams: A Guide for Employers",
    excerpt: "Discover how diversity improves innovation and learn strategies for inclusive hiring practices.",
    category: "Hiring",
    author: "Antonio Goldwire",
    date: "2025-10-18",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    slug: "manufacturing-automation-workforce",
    title: "How Manufacturing Automation Is Changing the Workforce",
    excerpt: "Explore the evolving role of human workers alongside automation and what skills will be in demand.",
    category: "Manufacturing",
    author: "Michael Chen",
    date: "2025-09-12",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  },
  {
    slug: "employee-retention-strategies",
    title: "Employee Retention Strategies for 2025",
    excerpt: "Keep your top talent engaged and committed with these proven retention strategies.",
    category: "HR",
    author: "Sarah Mitchell",
    date: "2025-08-25",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
  {
    slug: "financial-services-hiring-outlook",
    title: "Financial Services Hiring Outlook for 2025-2026",
    excerpt: "What finance and accounting professionals should expect from the job market in the coming year.",
    category: "Finance",
    author: "David Park",
    date: "2025-07-15",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);
  const featuredAuthor = authors[featuredPost.author as keyof typeof authors];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Blog & Insights</h1>
            <p className="mt-6 text-xl text-blue-100">
              Industry insights, career advice, and hiring tips from our team of experts.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <Badge>{featuredPost.category}</Badge>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="mt-4 text-lg text-gray-600">{featuredPost.excerpt}</p>
              <div className="mt-6 flex items-center gap-4">
                <Image
                  src={featuredAuthor.image}
                  alt={featuredPost.author}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{featuredPost.author}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredPost.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-6">
                <Link href={`/blog/${featuredPost.slug}`}>
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => {
              const postAuthor = authors[post.author as keyof typeof authors];
              return (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary">{post.category}</Badge>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <Image
                        src={postAuthor.image}
                        alt={post.author}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.author}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDate(post.date)}</span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Stay Updated</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest industry insights and career tips.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400"
            />
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

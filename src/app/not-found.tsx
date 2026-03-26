import Link from "next/link";
import { ArrowLeft, Search, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/jobs">
              <Briefcase className="w-5 h-5" />
              Browse Jobs
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t pt-8">
          <p className="text-sm text-gray-500 mb-4">Popular destinations</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/services"
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
            >
              Our Services
            </Link>
            <Link
              href="/industries"
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
            >
              Industries
            </Link>
            <Link
              href="/employers"
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

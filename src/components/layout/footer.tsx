import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import { siteConfig, navigation } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white">
                Humanly<span className="text-blue-400">Staffing</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-gray-400">
              {siteConfig.description}
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5 text-blue-400" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 text-blue-400" />
                {siteConfig.contact.email}
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address.full}</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.footer.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Industries
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.footer.industries.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {navigation.footer.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Account Login */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Account Login
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/sign-in"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Employee Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Employer Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Stay Updated
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Get the latest job openings and industry insights.
              </p>
              <form className="mt-4 flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              {navigation.footer.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

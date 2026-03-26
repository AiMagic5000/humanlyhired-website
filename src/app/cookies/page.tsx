import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for Brand Metrics LLC Learn how we use cookies, tracking technologies, and how to manage your preferences.",
};

const effectiveDate = "January 13, 2026";
const lastUpdated = "January 13, 2026";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
          <p className="mt-4 text-blue-100 text-lg">
            This policy explains how we use cookies and similar technologies on our website.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-200">
            <span>
              <strong className="text-white">Effective Date:</strong>{" "}
              {effectiveDate}
            </span>
            <span>|</span>
            <span>
              <strong className="text-white">Last Updated:</strong>{" "}
              {lastUpdated}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Quick Summary */}
        <div className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900">
            Cookie Policy Summary
          </h2>
          <p className="mt-2 text-blue-800">
            We use cookies to enhance your experience, analyze site usage, and enable certain functionalities.
            Essential cookies are required for the site to function. You can manage non-essential cookies through
            your browser settings or our cookie preferences tool.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Table of Contents
          </h2>
          <ol className="mt-4 columns-1 gap-6 space-y-2 text-sm md:columns-2">
            {[
              { num: "1", title: "What Are Cookies?" },
              { num: "2", title: "Types of Cookies We Use" },
              { num: "3", title: "Cookie Categories" },
              { num: "4", title: "Third-Party Cookies" },
              { num: "5", title: "Managing Your Cookie Preferences" },
              { num: "6", title: "Browser Cookie Settings" },
              { num: "7", title: "Impact of Disabling Cookies" },
              { num: "8", title: "Updates to This Policy" },
              { num: "9", title: "Contact Us" },
            ].map((item) => (
              <li key={item.num}>
                <a
                  href={`#section-${item.num}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.num}. {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Policy Content */}
        <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
          {/* Section 1 */}
          <section id="section-1" className="mb-12">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit websites. They are widely used to make websites work more efficiently, provide information to website owners, and enable personalized experiences.
            </p>
            <p>
              Cookies serve various purposes, including remembering your preferences, understanding how you interact with our website, and improving our services. Some cookies are essential for the website to function properly, while others help us analyze usage patterns and deliver relevant content.
            </p>
            <p>
              In addition to cookies, we may also use similar technologies such as:
            </p>
            <ul>
              <li>
                <strong>Web Beacons (Pixels):</strong> Small transparent images embedded in web pages or emails that track whether content has been viewed or accessed.
              </li>
              <li>
                <strong>Local Storage:</strong> Technology that allows websites to store data locally on your browser, similar to cookies but with larger storage capacity.
              </li>
              <li>
                <strong>Session Storage:</strong> Similar to local storage but data is cleared when you close your browser session.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-12">
            <h2>2. Types of Cookies We Use</h2>

            <h3>Session Cookies</h3>
            <p>
              Session cookies are temporary cookies that are deleted when you close your browser. They help our website remember your actions during a single browsing session, such as items in a shopping cart or form data you&apos;ve entered.
            </p>

            <h3>Persistent Cookies</h3>
            <p>
              Persistent cookies remain on your device for a set period of time or until you delete them manually. They help us recognize you when you return to our website and remember your preferences across multiple sessions.
            </p>

            <h3>First-Party Cookies</h3>
            <p>
              First-party cookies are set directly by Humanly Hired (humanlyhired.com). These cookies are used to enable core website functionality, remember your preferences, and analyze how you use our website.
            </p>

            <h3>Third-Party Cookies</h3>
            <p>
              Third-party cookies are set by services we integrate with, such as analytics providers and authentication services. These cookies help us understand website usage and provide certain features like social sharing and user authentication.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-12">
            <h2>3. Cookie Categories</h2>

            <h3>Strictly Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly and cannot be disabled in our systems. They are typically set in response to actions you take, such as setting privacy preferences, logging in, or filling in forms.
            </p>
            <div className="my-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600"><strong>Examples:</strong></p>
              <ul className="text-sm text-gray-600 mt-2">
                <li>Authentication session cookies</li>
                <li>Security tokens for form submissions</li>
                <li>Cookie consent preferences</li>
                <li>Load balancing cookies</li>
              </ul>
            </div>

            <h3>Performance and Analytics Cookies</h3>
            <p>
              These cookies collect information about how you use our website, such as which pages you visit most often and if you receive error messages. This information helps us improve how our website works.
            </p>
            <div className="my-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600"><strong>Data Collected:</strong></p>
              <ul className="text-sm text-gray-600 mt-2">
                <li>Pages visited and time spent</li>
                <li>Links clicked and navigation paths</li>
                <li>Error messages encountered</li>
                <li>Browser and device information</li>
              </ul>
            </div>

            <h3>Functional Cookies</h3>
            <p>
              Functional cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
            <div className="my-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600"><strong>Features Enabled:</strong></p>
              <ul className="text-sm text-gray-600 mt-2">
                <li>Remembering your preferences (language, region)</li>
                <li>Saved job searches and applications</li>
                <li>Personalized content recommendations</li>
                <li>Chat and support features</li>
              </ul>
            </div>

            <h3>Targeting and Advertising Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners. They are used to build a profile of your interests and show you relevant advertisements on other websites. We limit our use of advertising cookies and do not sell your personal information.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-12">
            <h2>4. Third-Party Cookies</h2>
            <p>
              We work with the following third-party services that may set cookies on your device:
            </p>

            <div className="my-6 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Google Analytics</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Website analytics and usage tracking</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Analytics</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm">Clerk</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">User authentication and account management</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-sm">LinkedIn</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Social sharing and professional network integration</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Functional</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm">Cloudflare</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Security and performance optimization</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">Essential</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              For more information about how these third parties use cookies, please refer to their privacy policies:
            </p>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Clerk Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Cloudflare Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-12">
            <h2>5. Managing Your Cookie Preferences</h2>
            <p>
              You have several options for managing cookies:
            </p>

            <h3>Cookie Consent Banner</h3>
            <p>
              When you first visit our website, you may see a cookie consent banner that allows you to accept or customize your cookie preferences. You can change your preferences at any time by clicking the cookie settings link in the website footer.
            </p>

            <h3>Opt-Out Tools</h3>
            <p>
              You can opt out of specific tracking services:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> Install the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <strong>Interest-Based Advertising:</strong> Visit the{" "}
                <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Digital Advertising Alliance opt-out page
                </a>
              </li>
              <li>
                <strong>Network Advertising Initiative:</strong> Visit{" "}
                <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  NAI opt-out page
                </a>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-12">
            <h2>6. Browser Cookie Settings</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. Here&apos;s how to manage cookies in popular browsers:
            </p>

            <div className="my-6 space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900">Google Chrome</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Settings &gt; Privacy and Security &gt; Cookies and other site data
                </p>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Chrome cookie instructions
                </a>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900">Mozilla Firefox</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data
                </p>
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Firefox cookie instructions
                </a>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900">Safari</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Preferences &gt; Privacy &gt; Manage Website Data
                </p>
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Safari cookie instructions
                </a>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900">Microsoft Edge</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data
                </p>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Edge cookie instructions
                </a>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-12">
            <h2>7. Impact of Disabling Cookies</h2>
            <p>
              If you choose to disable or block certain cookies, some features of our website may not function properly:
            </p>
            <ul>
              <li>
                <strong>Authentication:</strong> You may not be able to log in to your account or access personalized features
              </li>
              <li>
                <strong>Preferences:</strong> Your settings and preferences may not be saved between sessions
              </li>
              <li>
                <strong>Forms:</strong> You may encounter issues submitting forms or applications
              </li>
              <li>
                <strong>Security:</strong> Some security features that rely on cookies may be affected
              </li>
            </ul>
            <p>
              We recommend keeping essential cookies enabled to ensure the best possible experience on our website.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-12">
            <h2>8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices, technologies, or legal requirements. When we make significant changes, we will:
            </p>
            <ul>
              <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
              <li>Display a notice on our website about the changes</li>
              <li>Request renewed consent if required by applicable law</li>
            </ul>
            <p>
              We encourage you to review this policy periodically to stay informed about how we use cookies.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-12">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>

            <div className="my-6 rounded-xl border border-gray-200 bg-gray-50 p-6 not-prose">
              <p className="font-semibold text-gray-900 text-lg">
                Brand Metrics LLC
              </p>
              <p className="mt-2 text-gray-700">
                Attn: Privacy Officer
                <br />
                1501 South Greeley Highway, Suite C
                <br />
                Cheyenne, WY 82007
                <br />
                United States
              </p>
              <p className="mt-4 text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@humanlyhired.com
                </a>
                <br />
                <strong>General Inquiries:</strong>{" "}
                <a
                  href="mailto:contact@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@humanlyhired.com
                </a>
                <br />
                <strong>Phone:</strong> (888) 762-6691
              </p>
            </div>

            <p>
              For more information about how we handle your personal data, please see our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          {/* Final Statement */}
          <section className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <p className="text-center text-gray-600">
              This Cookie Policy was last updated on{" "}
              <strong>{lastUpdated}</strong> and is effective as of{" "}
              <strong>{effectiveDate}</strong>.
            </p>
            <p className="mt-4 text-center text-gray-600">
              <strong>Brand Metrics LLC</strong>
              <br />
              1501 South Greeley Highway, Suite C
              <br />
              Cheyenne, WY 82007
              <br />A Wyoming Corporation
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

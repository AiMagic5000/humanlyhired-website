import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SafeSignIn } from "@/components/auth/safe-auth-forms";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Humanly Hired account to access your dashboard, applications, and more.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Professional team meeting"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link href="/" className="text-2xl font-bold mb-8">
            Humanly<span className="text-blue-200">Staffing</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-md">
            Sign in to access your personalized dashboard, track applications, and discover new opportunities.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Track your job applications in real-time</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Get personalized job recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Connect directly with top employers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Humanly<span className="text-gray-900">Staffing</span>
            </Link>
          </div>
          <SafeSignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border border-gray-100 rounded-2xl",
                headerTitle: "text-2xl font-bold text-gray-900",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-2 border-gray-200 hover:bg-gray-50 transition-colors",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-700 font-medium",
                formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/sign-in"
          />
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

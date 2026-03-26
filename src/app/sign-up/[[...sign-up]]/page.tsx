import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SafeSignUp } from "@/components/auth/safe-auth-forms";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Humanly Hired account to find your next career opportunity or hire top talent.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-blue-700">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Diverse team collaborating"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link href="/" className="text-2xl font-bold mb-8">
            Humanly<span className="text-indigo-200">Staffing</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Start Your Journey
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-md">
            Join thousands of professionals who have found their dream careers through Humanly Hired.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">2,500+</p>
              <p className="text-indigo-200 text-sm">Successful Placements</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-indigo-200 text-sm">Satisfaction Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-indigo-200 text-sm">Partner Companies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">12+</p>
              <p className="text-indigo-200 text-sm">Industries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Humanly<span className="text-gray-900">Staffing</span>
            </Link>
          </div>
          <SafeSignUp
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
            path="/sign-up"
          />
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

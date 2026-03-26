"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Error Visual */}
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Critical Error
          </h1>
          <p className="text-gray-600 mb-8">
            A critical error occurred. Please refresh the page or try again later.
          </p>

          {/* Actions */}
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

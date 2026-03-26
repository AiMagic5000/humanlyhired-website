export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        <p className="text-gray-500 mt-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}

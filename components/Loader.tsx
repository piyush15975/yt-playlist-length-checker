"use client"

const Loader = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-red-500 border-r-red-600 rounded-full animate-spin"></div>
      </div>

      {/* Animated Dots */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-300"></span>
      </div>

      {/* Loading Text */}
      <p className="text-slate-400 text-sm font-medium text-center">
        Analyzing playlist...
      </p>
    </div>
  )
}

export default Loader

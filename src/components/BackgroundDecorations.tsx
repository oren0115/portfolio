export function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30"></div>
      
      {/* Animated blob shapes */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-300/30 blur-3xl animate-pulse"></div>
      <div 
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-purple-200/40 to-pink-300/30 blur-3xl animate-pulse" 
        style={{ animationDelay: '1s' }}
      ></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.6)_100%)]"></div>
    </div>
  );
}


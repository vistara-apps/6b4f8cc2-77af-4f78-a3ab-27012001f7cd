export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full mx-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-3/4 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-5/6"></div>
            <div className="h-4 bg-white/20 rounded w-4/6"></div>
          </div>
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      </div>
    </div>
  );
}

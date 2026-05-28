export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-ink p-4 text-white">
      <div className="mx-auto grid max-w-7xl gap-4 pt-8">
        <div className="h-16 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="h-32 animate-pulse rounded-lg bg-white/10" key={item} />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

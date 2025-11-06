export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <li className="card">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </li>
  );
}

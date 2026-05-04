import { Skeleton } from "@/shared/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-1/2 max-w-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

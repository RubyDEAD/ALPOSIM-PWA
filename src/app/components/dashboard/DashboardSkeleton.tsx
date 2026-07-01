import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div className="space-y-3">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded-lg" />
          </div>

          <Skeleton className="h-12 w-40 rounded-2xl" />

        </div>

        {/* Stats */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-36 rounded-3xl"
            />
          ))}

        </div>

        {/* Revenue */}

        <div className="grid gap-5 lg:grid-cols-12">

          <Skeleton className="h-[380px] rounded-3xl lg:col-span-8" />

          <Skeleton className="h-[380px] rounded-3xl lg:col-span-4" />

        </div>

        {/* Middle */}

        <div className="grid gap-5 lg:grid-cols-12">

          <Skeleton className="h-[320px] rounded-3xl lg:col-span-7" />

          <Skeleton className="h-[320px] rounded-3xl lg:col-span-5" />

        </div>

        {/* Bottom */}

        <div className="grid gap-5 lg:grid-cols-12">

          <Skeleton className="h-[320px] rounded-3xl lg:col-span-6" />

          <Skeleton className="h-[320px] rounded-3xl lg:col-span-6" />

        </div>

      </div>

    </div>
  );
}
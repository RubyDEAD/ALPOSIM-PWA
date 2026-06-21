import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LoadingSkeletonProps {
  rows?: number;
}

export default function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[28%]"><Skeleton className="h-3 w-24" /></TableHead>
            <TableHead className="w-[13%]"><Skeleton className="h-3 w-10" /></TableHead>
            <TableHead className="w-[12%]"><Skeleton className="h-3 w-16" /></TableHead>
            <TableHead className="w-[15%]"><Skeleton className="h-3 w-20" /></TableHead>
            <TableHead className="w-[11%]"><Skeleton className="h-3 w-14" /></TableHead>
            <TableHead className="w-[5%]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">

              {/* Product name + icon */}
              <TableCell className="py-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              {/* SKU */}
              <TableCell className="py-3">
                <Skeleton className="h-3 w-16" />
              </TableCell>

              {/* Category pill */}
              <TableCell className="py-3">
                <Skeleton className="h-5 w-16 rounded-md" />
              </TableCell>

              {/* Stock bar */}
              <TableCell className="py-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-[3px] w-full rounded-full" />
                </div>
              </TableCell>

              {/* Price */}
              <TableCell className="py-3 text-right">
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
              </TableCell>

              {/* Action button */}
              <TableCell className="py-3 text-right">
                <Skeleton className="h-7 w-7 rounded-md ml-auto" />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
import { LucideIcon, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon = Package,
  message = "No products found",
  actionLabel = "Add your first product",
  actionHref = "/inventory/add",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed rounded-xl bg-white">
      <Icon className="w-10 h-10 mb-3 opacity-20" />
      <p className="text-sm font-medium">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="link" className="text-amber-600 mt-1 h-auto p-0 text-sm">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
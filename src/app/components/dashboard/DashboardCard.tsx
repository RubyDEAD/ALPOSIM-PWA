import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  description,
  icon,
  action,
  children,
  className,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {(title || description) && (
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {icon}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {title}
              </h3>

              {description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action}
        </header>
      )}

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
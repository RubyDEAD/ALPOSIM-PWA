import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
  action?: ReactNode;
  badge?: string;
}

export function CardContainer({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  icon,
  action,
  badge,
}: CardContainerProps) {
  return (
    <div className={cn(
      'w-full md:w-1/2 bg-white rounded-2xl border border-border shadow-sm overflow-hidden',
      'transition-shadow duration-200 hover:shadow-md',
      className
    )}>

      {/* Amber accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />

      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-3 py-3',
        'border-b border-border/60 bg-gray-50/60',
        headerClassName
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-500 shadow-sm">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-foreground leading-tight truncate py-0.5">
                {title}
              </p>
              {badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate py-0.5">{description}</p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0 ml-3">{action}</div>
        )}
      </div>

      {/* Content */}
      <div className={cn('px-5 py-4', contentClassName)}>
        {children}
      </div>

    </div>
  );
}



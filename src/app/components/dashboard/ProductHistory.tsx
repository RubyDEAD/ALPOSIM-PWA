'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ProductHistory as ProductHistoryType } from '@/src/types/types';

interface ProductHistoryProps {
  history: ProductHistoryType[];
}

export function ProductHistory({ history }: ProductHistoryProps) {
  return (
    <div className="rounded-xl">
      {/* Header section formerly handled by CardContainer */}
      <div className="mb-5 space-y-1">
  
        <p className="text-xs text-muted-foreground">
          Latest product updates
        </p>
      </div>

      {/* Main Content Area */}
      {history.length === 0 ? (
        <div className="flex h-32 min-h-full items-center justify-center text-sm text-muted-foreground">
          No recent activity found.
        </div>
      ) : (
        <div className="space-y-4">
          {history.slice(0, 5).map((item) => (
            <div 
              key={item.id} 
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Product #{item.productId}
                  </span>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {item.action.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">{item.fieldChanged}</span>:{' '}
                  <span className="line-through opacity-70">{item.oldValue}</span> →{' '}
                  <span className="font-medium text-foreground">{item.newValue}</span>
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  {format(new Date(item.changedAt), 'MMM d, yyyy')}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  by {item.changedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
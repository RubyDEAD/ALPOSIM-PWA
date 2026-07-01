'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/src/types/types';
import { cn } from '@/lib/utils';

interface InventoryStatusProps {
  products: Product[];
}

export function InventoryStatus({ products }: InventoryStatusProps) {
  const lowStock = products.filter(p => p.quantity <= p.minQuantity);
  const outOfStock = products.filter(p => p.quantity === 0);

  return (
    <div className="rounded-xl text-card-foreground ">
      {/* Header section formerly handled by CardContainer */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-1">
        
          <p className="text-xs text-muted-foreground">
            Current stock levels
          </p>
        </div>
        <div className="shrink-0">
          <Badge variant={lowStock.length > 0 ? 'destructive' : 'default'}>
            {lowStock.length} low stock
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      {products.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No inventory data available.
        </div>
      ) : (
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => {
            const percentage = (product.quantity / (product.minQuantity * 2)) * 100;
            const isLow = product.quantity <= product.minQuantity;
            const isOut = product.quantity === 0;

            return (
              <div key={product.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{product.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {product.quantity} {product.metric}
                    </span>
                    {isOut && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Out
                      </Badge>
                    )}
                    {isLow && !isOut && (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                        Low
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={cn(
                    'h-2',
                    isOut && 'bg-red-100 [&>div]:bg-red-500',
                    isLow && !isOut && 'bg-yellow-100 [&>div]:bg-yellow-500'
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/src/types/types';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const sorted = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);

  return (
    <div className="rounded-xl ">
      {/* Main Content Area */}
      {sorted.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No product data available.
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-4">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.productCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  ₱{product.sellingPrice.toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5">
                  {product.quantity} units
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
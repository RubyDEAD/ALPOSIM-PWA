import { CardContainer } from './CardContainer';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/src/types/types';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const sorted = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);

  return (
    <CardContainer
      title="Top Products"
      description="Best selling items by value"
    >
      <div className="space-y-3">
        {sorted.slice(0, 5).map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6">
                #{index + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.productCode}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">${product.sellingPrice.toFixed(2)}</p>
              <Badge variant="secondary" className="text-[10px]">
                {product.quantity} units
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContainer>
  );
}
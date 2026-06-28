import { CardContainer } from './CardContainer';
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
    <CardContainer
      title="Inventory Status"
      description="Current stock levels"
      action={
        <Badge variant={lowStock.length > 0 ? 'destructive' : 'default'}>
          {lowStock.length} low stock
        </Badge>
      }
    >
      <div className="space-y-3">
        {products.slice(0, 5).map((product) => {
          const percentage = (product.quantity / (product.minQuantity * 2)) * 100;
          const isLow = product.quantity <= product.minQuantity;
          const isOut = product.quantity === 0;

          return (
            <div key={product.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{product.quantity} {product.metric}</span>
                  {isOut && <Badge variant="destructive" className="text-[10px]">Out</Badge>}
                  {isLow && !isOut && <Badge variant="warning" className="text-[10px]">Low</Badge>}
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
    </CardContainer>
  );
}
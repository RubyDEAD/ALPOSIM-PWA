import { CardContainer } from './CardContainer';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ProductHistory as ProductHistoryType } from '@/src/types/types';

interface ProductHistoryProps {
  history: ProductHistoryType[];
}

export function ProductHistory({ history }: ProductHistoryProps) {
  return (
    <CardContainer
      title="Recent Activity"
      description="Latest product updates"
    >
      <div className="space-y-3">
        {history.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.productId}</span>
                <Badge variant="outline" className="text-[10px]">
                  {item.action}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.fieldChanged}: {item.oldValue} → {item.newValue}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {format(new Date(item.changedAt), 'MMM d')}
              </p>
              <p className="text-xs text-muted-foreground">{item.changedBy}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContainer>
  );
}
import { Button } from '@/components/ui/button';
import { CardContainer } from './CardContainer';
import { 
  PlusCircle, 
  ShoppingCart, 
  Package, 
  FileText,
  Settings,
  Users 
} from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface QuickActionsProps {
  actions?: ActionItem[];
}

const defaultActions: ActionItem[] = [
  { label: 'New Sale', icon: <ShoppingCart className="h-4 w-4" />, onClick: () => {}, variant: 'default' },
  { label: 'Add Product', icon: <PlusCircle className="h-4 w-4" />, onClick: () => {}, variant: 'secondary' },
  { label: 'Manage Stock', icon: <Package className="h-4 w-4" />, onClick: () => {}, variant: 'outline' },
  { label: 'Reports', icon: <FileText className="h-4 w-4" />, onClick: () => {}, variant: 'outline' },
];

export function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <CardContainer
      title="Quick Actions"
      description="Frequently used operations"
    >
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            className="justify-start gap-2 h-auto py-3 px-4"
            onClick={action.onClick}
          >
            {action.icon}
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </CardContainer>
  );
}
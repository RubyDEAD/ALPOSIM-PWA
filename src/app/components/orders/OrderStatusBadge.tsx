import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  onlinePayment: boolean;
}

export function OrderStatusBadge({
  onlinePayment,
}: OrderStatusBadgeProps) {
  return (
    <Badge
      variant={onlinePayment ? "default" : "secondary"}
      className={
        onlinePayment
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      }
    >
      {onlinePayment ? "Online" : "Cash"}
    </Badge>
  );
}
import { Sale } from "@/src/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  PhilippinePeso,
  Wallet,
  CreditCard,
} from "lucide-react";

interface OrderSummaryCardsProps {
  orders: Sale[];
}

export function OrderSummaryCards({
  orders,
}: OrderSummaryCardsProps) {
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const cashOrders = orders.filter(
    (order) => !order.onlinePayment
  ).length;

  const onlineOrders = orders.filter(
    (order) => order.onlinePayment
  ).length;

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: `₱${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: PhilippinePeso,
    },
    {
      title: "Cash Orders",
      value: cashOrders.toLocaleString(),
      icon: Wallet,
    },
    {
      title: "Online Payments",
      value: onlineOrders.toLocaleString(),
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 p-6">
      {cards.map(({ title, value, icon: Icon }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {title}
            </CardTitle>

            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
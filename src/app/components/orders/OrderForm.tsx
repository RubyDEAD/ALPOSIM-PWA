'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';

import { SaleInput, SaleSchema } from '@/src/schema/schema';
import { Product } from '@/src/types/types';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderFormProps {
  products: Product[];
  defaultValues?: SaleInput;
  loading?: boolean;
  onSubmit: (data: SaleInput) => void | Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);

export function OrderForm({
  products,
  defaultValues,
  loading = false,
  onSubmit,
}: OrderFormProps) {
  const form = useForm<SaleInput>({
    resolver: zodResolver(SaleSchema),
    defaultValues:
      defaultValues ?? {
        items: [
          {
            productId: '',
            quantity: 1,
          },
        ],
        receivedCash: 0,
        onlinePayment: false,
      },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems = form.watch('items') ?? [];
  const receivedCash = Number(form.watch('receivedCash') ?? 0);
  const onlinePayment = form.watch('onlinePayment') ?? false;

  const itemSummaries = useMemo(() => {
    return watchedItems.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const unitPrice = product?.sellingPrice ?? 0;
      const quantity = Number(item.quantity || 0);
      const subtotal = unitPrice * quantity;

      return {
        product,
        unitPrice,
        quantity,
        subtotal,
      };
    });
  }, [products, watchedItems]);

  const grandTotal = useMemo(() => {
    return itemSummaries.reduce((total, item) => total + item.subtotal, 0);
  }, [itemSummaries]);

  const change = receivedCash - grandTotal;
  const hasCashShortage = !onlinePayment && receivedCash < grandTotal;

  const handleSubmit = form.handleSubmit((data) => {
    if (!onlinePayment && data.receivedCash < grandTotal) {
      form.setError('receivedCash', {
        type: 'manual',
        message: 'Received cash must cover the order total',
      });
      return;
    }

    void onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <p className="text-sm text-muted-foreground">
              Choose products, adjust quantities, and see the live pricing.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-sm">
            {fields.length} item{fields.length === 1 ? '' : 's'}
          </span>
        </div>

        {fields.map((field, index) => {
          const summary = itemSummaries[index] ?? {
            product: undefined,
            unitPrice: 0,
            quantity: 0,
            subtotal: 0,
          };

          return (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-3 rounded-lg border border-border/60 bg-background p-3"
            >
              <div className="col-span-12 md:col-span-7">
                <label className="mb-1 block text-sm font-medium">Product</label>

                <Select
                  value={form.watch(`items.${index}.productId`) ?? ''}
                  onValueChange={(value) =>
                    form.setValue(`items.${index}.productId`, value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.items?.[index]?.productId?.message}
                </p>
              </div>

              <div className="col-span-6 md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Quantity</label>

                <Input
                  type="number"
                  min={1}
                  {...form.register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />

                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.items?.[index]?.quantity?.message}
                </p>
              </div>

              <div className="col-span-6 md:col-span-2">
                <div className="rounded-md border border-border/60 bg-muted/40 p-3 text-sm">
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-semibold">{formatCurrency(summary.unitPrice)}</div>
                  <div className="mt-2 text-muted-foreground">Subtotal</div>
                  <div className="font-semibold">{formatCurrency(summary.subtotal)}</div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              productId: '',
              quantity: 1,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Received Cash</label>

              <Input
                type="number"
                min={0}
                step="0.01"
                {...form.register('receivedCash', {
                  valueAsNumber: true,
                })}
              />

              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.receivedCash?.message}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Payment Method</label>

              <Select
                value={onlinePayment ? 'online' : 'cash'}
                onValueChange={(value) =>
                  form.setValue('onlinePayment', value === 'online', {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Grand total</span>
              <span className="font-semibold text-foreground">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>Change</span>
              <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {formatCurrency(change)}
              </span>
            </div>

            {!onlinePayment && (
              <div
                className={`mt-4 rounded-md border px-3 py-2 text-sm ${
                  hasCashShortage
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {hasCashShortage
                  ? `Still due: ${formatCurrency(grandTotal - receivedCash)}`
                  : 'Cash is sufficient for this order.'}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Button type="submit" className="w-full" disabled={loading || (hasCashShortage && !onlinePayment)}>
        {loading ? 'Saving...' : 'Save Order'}
      </Button>
    </form>
  );
}

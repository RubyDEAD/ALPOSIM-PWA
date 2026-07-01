'use client';

import { useMemo, useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, AlertCircle, ShoppingBag, RefreshCw, Loader2 } from 'lucide-react';

import { Product } from '@/src/types/types';
import { SaleInput, SaleSchema } from '@/src/schema/schema';
import { useProducts } from '@/src/app/hooks/useProduct';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWatch} from 'react-hook-form';
interface OrderFormProps {
  defaultValues?: SaleInput;
  loading?: boolean;
  onSubmit: (data: SaleInput) => void | Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function OrderForm({
  defaultValues,
  loading = false,
  onSubmit,
}: OrderFormProps) {
  // Fetch all products
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useProducts();

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
        receivedCash: undefined,
        onlinePayment: false,
      },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems = useWatch({ control: form.control, name: 'items' }) ?? [];

  const receivedCash = Number(useWatch({ control: form.control, name: 'receivedCash' }) ?? 0);
  const onlinePayment = useWatch({ control: form.control, name: 'onlinePayment' }) ?? false;

  // ✅ Create a map of productId to product data
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((product: Product) => {
      map.set(product.id, product);
    });
    return map;
  }, [products]);

  const itemSummaries = useMemo(() => {
    return watchedItems.map((item) => {
      const product = productMap.get(item.productId);
      const unitPrice = product?.sellingPrice ?? 0;
      const quantity = Number(item.quantity || 0);
      const subtotal = unitPrice * quantity;

      return {
        product,
        unitPrice,
        quantity,
        subtotal,
        productName: product?.name ?? 'Unknown Product',
        inStock: (product?.quantity ?? 0) >= quantity,
        productId: item.productId,
        hasProduct: !!product,
      };
    });
  }, [watchedItems, productMap]);

  const grandTotal = useMemo(() => {
    return itemSummaries.reduce((total, item) => total + item.subtotal, 0);
  }, [itemSummaries]);

  const change = receivedCash - grandTotal;
  const hasCashShortage = !onlinePayment && receivedCash < grandTotal;
  const hasItems = fields.length > 0 && watchedItems.some(item => item.productId !== '');
  const hasStockIssues = itemSummaries.some(item => !item.inStock && item.product);

  const selectedProductIds = watchedItems
    .map(item => item.productId)
    .filter(id => id !== '');

  // ✅ Fixed: Filter available products with proper type
  const availableProducts = useMemo(() => {
    return products.filter((product: Product) => !selectedProductIds.includes(product.id));
  }, [products, selectedProductIds]);

  const handleAddItem = useCallback(() => {
    append({
      productId: '',
      quantity: 1,
    });
  }, [append]);

  const handleRemoveItem = useCallback((index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  }, [fields.length, remove]);

  const handleSubmit = form.handleSubmit((data) => {
      console.log('Submitting payload:', JSON.stringify(data, null, 2)); // ← add this
    if (!hasItems) {
      form.setError('root', {
        type: 'manual',
        message: 'Please add at least one product to the order',
      });
      return;

    }

    if (hasStockIssues) {
      form.setError('root', {
        type: 'manual',
        message: 'One or more items exceed available stock',
      });
      return;
    }

    if (!onlinePayment && data.receivedCash < grandTotal) {
      form.setError('receivedCash', {
        type: 'manual',
        message: 'Received cash must cover the order total',
      });
      return;
    }

    void onSubmit(data);
  });

  // Loading state
  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load products. Please refresh the page.
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={() => refetchProducts()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Items
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose products, adjust quantities, and see the live pricing.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {fields.length} item{fields.length === 1 ? '' : 's'}
          </span>
        </div>

        {fields.map((field, index) => {
          const summary = itemSummaries[index] ?? {
            product: undefined,
            unitPrice: 0,
            quantity: 0,
            subtotal: 0,
            productName: 'Unknown Product',
            inStock: true,
            productId: '',
            hasProduct: false,
          };

          const currentProductId = form.watch(`items.${index}.productId`) ?? '';
          const hasProduct = currentProductId !== '' && summary.hasProduct;

          return (
            <div
              key={field.id}
              className={`grid grid-cols-12 gap-3 rounded-lg border p-3 transition-all duration-300 ${
                summary.product && !summary.inStock
                  ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                  : hasProduct
                  ? 'border-green-300 bg-green-50/30 dark:border-green-800 dark:bg-green-950/10 shadow-sm'
                  : 'border-border/60 bg-background hover:border-border'
              }`}
            >
              <div className="col-span-12 md:col-span-7">
                <label className="mb-1 block text-sm font-medium">Product</label>

                <Select
                  value={currentProductId}
                  onValueChange={(value) => {
                    form.setValue(`items.${index}.productId`, value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger 
                    className={`transition-all ${
                      form.formState.errors.items?.[index]?.productId 
                        ? 'border-red-500' 
                        : hasProduct
                        ? 'border-green-400 dark:border-green-600'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((product: Product) => {
                      const isSelected = selectedProductIds.includes(product.id) && 
                                        product.id !== currentProductId;
                      return (
                        <SelectItem 
                          key={product.id} 
                          value={product.id}
                          disabled={isSelected}
                          className={isSelected ? 'opacity-50' : ''}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{product.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ₱{product.sellingPrice} | Stock: {product.quantity}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {form.formState.errors.items?.[index]?.productId && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.items[index]?.productId?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Quantity</label>

             <Input
                type="number"
                min={1}
                max={summary.product?.quantity ?? 999}
                className={form.formState.errors.items?.[index]?.quantity ? 'border-red-500' : ''}
                value={form.watch(`items.${index}.quantity`) ?? 1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue(
                    `items.${index}.quantity`,
                    Number(e.target.value) || 1,
                    { shouldDirty: true, shouldValidate: true }
                  )
                }
              />

                {form.formState.errors.items?.[index]?.quantity && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.items[index]?.quantity?.message}
                  </p>
                )}
                
                {summary.product && !summary.inStock && (
                  <p className="mt-1 text-sm text-red-500">
                    ⚠️ Only {summary.product.quantity} in stock
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2">
                <div className={`rounded-md border p-3 text-sm transition-all duration-300 ${
                  hasProduct 
                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20 shadow-sm' 
                    : 'border-border/60 bg-muted/40'
                }`}>
                  <div className="text-muted-foreground">Price</div>
                  <div className={`font-semibold transition-all duration-300 ${
                    hasProduct ? 'text-green-600 dark:text-green-400 text-base' : ''
                  }`}>
                    {formatCurrency(summary.unitPrice)}
                  </div>
                  <div className="mt-2 text-muted-foreground">Subtotal</div>
                  <div className={`font-semibold transition-all duration-300 ${
                    hasProduct ? 'text-green-600 dark:text-green-400 text-base' : ''
                  }`}>
                    {formatCurrency(summary.subtotal)}
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-1 flex justify-end items-start">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  disabled={fields.length === 1}
                  onClick={() => handleRemoveItem(index)}
                  className="mt-1"
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
          onClick={handleAddItem}
          className="w-full sm:w-auto"
          disabled={availableProducts.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item {availableProducts.length === 0 && '(All products added)'}
        </Button>
      </div>

      <Card className="space-y-4 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Received Cash</label>
           <Input
              type="number"
              step="0.01"
              placeholder="₱100.00"
              className={form.formState.errors.receivedCash ? 'border-red-500' : ''}
              {...form.register('receivedCash', {
                valueAsNumber: true,
              })}
              defaultValue=""
            />
              {form.formState.errors.receivedCash && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.receivedCash?.message}
                </p>
              )}
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

          <div className="rounded-lg border border-border/60 bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{fields.length} item{fields.length === 1 ? '' : 's'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Grand Total</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Change</span>
              <span className={`text-lg font-semibold ${change >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {formatCurrency(change)}
              </span>
            </div>

            {!onlinePayment && grandTotal > 0 && (
              <div
                className={`mt-2 rounded-md border px-3 py-2 text-sm ${
                  hasCashShortage
                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30'
                }`}
              >
                {hasCashShortage
                  ? `⚠️ Still due: ${formatCurrency(grandTotal - receivedCash)}`
                  : '✅ Cash is sufficient for this order.'}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={
          loading || 
          (hasCashShortage && !onlinePayment) || 
          !hasItems || 
          hasStockIssues
        }
        size="lg"
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Saving...
          </>
        ) : (
          <>
           
            Submit Order
          </>
        )}
      </Button>
    </form>
  );
}
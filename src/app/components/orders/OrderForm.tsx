'use client';

import { useMemo, useCallback, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, AlertCircle, ShoppingBag, Loader2, Search, X, Package } from 'lucide-react';

import { Product } from '@/src/types/types';
import { SaleInput, SaleSchema } from '@/src/schema/schema';
import { FetchProducts } from '@/src/api/product';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  }).format(value);

const STATUS_COLORS: Record<string, string> = {
  Critical: 'text-red-500',
  Low:      'text-amber-500',
  Normal:   'text-blue-500',
  High:     'text-green-600',
};

// ── Product Search Picker ──────────────────────────────────────────────────
interface ProductPickerProps {
  products: Product[];
  value: string;
  disabledIds: string[];
  onChange: (id: string) => void;
  error?: string;
}

function ProductPicker({ products, value, disabledIds, onChange, error }: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = products.find(p => p.id === value);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      (p.name.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q)) &&
      !disabledIds.includes(p.id)
    );
  }, [products, search, disabledIds]);

  const handleSelect = (product: Product) => {
    onChange(product.id);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 h-9 px-3 rounded-lg border text-[13px] text-left transition-colors
          ${error ? 'border-red-400' : open ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-border hover:border-border/80'}
          bg-white`}
      >
        {selected ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Package className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate font-medium text-foreground">{selected.name}</span>
            <span className="text-[11px] text-muted-foreground flex-shrink-0">{selected.productCode}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Search product...</span>
        )}
        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-muted cursor-pointer"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </span>
          )}
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-muted/30 rounded-lg border border-border focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-muted-foreground">
                No products found
              </div>
            ) : (
              filtered.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-amber-50 transition-colors text-left border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Package className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-[11px] text-muted-foreground">{product.productCode}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[13px] font-semibold text-foreground">₱{product.sellingPrice.toLocaleString()}</p>
                    <p className={`text-[11px] font-medium ${STATUS_COLORS[product.status] ?? 'text-muted-foreground'}`}>
                      {product.quantity} {product.metric}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(''); }} />
      )}

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────
export function OrderForm({ defaultValues, loading = false, onSubmit }: OrderFormProps) {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts, error: productsError, refetch } = useQuery<Product[]>({
    queryKey: ['products-all'],
    queryFn: async () => {
      const res = await FetchProducts();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const form = useForm<SaleInput>({
    resolver: zodResolver(SaleSchema),
    defaultValues: defaultValues ?? {
      items: [{ productId: '', quantity: 1 }],
      receivedCash: 0,
      onlinePayment: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  const watchedItems = useWatch({ control: form.control, name: 'items' }) ?? [];
  const receivedCash = Number(useWatch({ control: form.control, name: 'receivedCash' }) ?? 0);
  const onlinePayment = useWatch({ control: form.control, name: 'onlinePayment' }) ?? false;

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach(p => map.set(p.id, p));
    return map;
  }, [products]);

  const itemSummaries = useMemo(() => watchedItems.map(item => {
    const product = productMap.get(item.productId);
    const unitPrice = product?.sellingPrice ?? 0;
    const quantity = Number(item.quantity || 0);
    return {
      product,
      unitPrice,
      quantity,
      subtotal: unitPrice * quantity,
      inStock: (product?.quantity ?? 0) >= quantity,
      hasProduct: !!product,
    };
  }), [watchedItems, productMap]);

  const grandTotal = useMemo(() => itemSummaries.reduce((t, i) => t + i.subtotal, 0), [itemSummaries]);
  const change = receivedCash - grandTotal;
  const hasCashShortage = !onlinePayment && receivedCash < grandTotal;
  const hasItems = fields.length > 0 && watchedItems.some(i => i.productId !== '');
  const hasStockIssues = itemSummaries.some(i => !i.inStock && i.product);
  const selectedIds = watchedItems.map(i => i.productId).filter(Boolean);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!hasItems) {
      form.setError('root', { message: 'Please add at least one product.' });
      return;
    }
    if (hasStockIssues) {
      form.setError('root', { message: 'One or more items exceed available stock.' });
      return;
    }
    if (!onlinePayment && data.receivedCash < grandTotal) {
      form.setError('receivedCash', { message: 'Received cash must cover the order total.' });
      return;
    }
    await onSubmit(data);
    // invalidate products so quantity updates in inventory
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['products-all'] });
  });

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
        <span className="text-[13px] text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  if (productsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          Failed to load products.
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {form.formState.errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-amber-500" />
            <h3 className="text-[14px] font-semibold">Order Items</h3>
          </div>
          <span className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {fields.length} item{fields.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Header row */}
        <div className="grid grid-cols-12 gap-3 px-1">
          <div className="col-span-7 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Product</div>
          <div className="col-span-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Qty</div>
          <div className="col-span-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Subtotal</div>
          <div className="col-span-1" />
        </div>

        {fields.map((field, index) => {
          const summary = itemSummaries[index];
          const currentId = form.watch(`items.${index}.productId`) ?? '';
          const otherSelectedIds = selectedIds.filter((_, i) => i !== index);

          return (
            <div
              key={field.id}
              className={`grid grid-cols-12 gap-3 items-start p-3 rounded-xl border transition-colors
                ${summary?.product && !summary.inStock
                  ? 'border-red-200 bg-red-50'
                  : summary?.hasProduct
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-border bg-white'}`}
            >
              {/* Product picker */}
              <div className="col-span-7">
                <ProductPicker
                  products={products}
                  value={currentId}
                  disabledIds={otherSelectedIds}
                  onChange={val => form.setValue(`items.${index}.productId`, val, { shouldValidate: true })}
                  error={form.formState.errors.items?.[index]?.productId?.message}
                />
                {summary?.product && !summary.inStock && (
                  <p className="mt-1 text-[11px] text-red-500">
                    ⚠ Only {summary.product.quantity} in stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  max={summary?.product?.quantity ?? 999}
                  className={`h-9 text-[13px] ${form.formState.errors.items?.[index]?.quantity ? 'border-red-400' : ''}`}
                  value={form.watch(`items.${index}.quantity`) ?? 1}
                  onChange={e => form.setValue(`items.${index}.quantity`, Number(e.target.value) || 1, { shouldValidate: true })}
                />
              </div>

              {/* Subtotal */}
              <div className="col-span-2 h-9 flex items-center">
                <span className={`text-[13px] font-semibold ${summary?.hasProduct ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {formatCurrency(summary?.subtotal ?? 0)}
                </span>
              </div>

              {/* Remove */}
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ productId: '', quantity: 1 })}
          disabled={selectedIds.length >= products.length}
          className="h-8 text-[12px] gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </Button>
      </div>

      {/* Payment */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">

          {/* Left: inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium mb-1">Payment method</label>
              <div className="flex gap-2">
                {(['cash', 'online'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => form.setValue('onlinePayment', method === 'online', { shouldValidate: true })}
                    className={`flex-1 h-9 rounded-lg border text-[13px] font-medium transition-colors capitalize
                      ${(method === 'online') === onlinePayment
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-border text-muted-foreground hover:border-amber-300'}`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {!onlinePayment && (
              <div>
                <label className="block text-[12px] font-medium mb-1">Received cash</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">₱</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`h-9 text-[13px] pl-6 ${form.formState.errors.receivedCash ? 'border-red-400' : ''}`}
                    {...form.register('receivedCash', { valueAsNumber: true })}
                  />
                </div>
                {form.formState.errors.receivedCash && (
                  <p className="mt-1 text-[11px] text-red-500">{form.formState.errors.receivedCash.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{fields.length}</span>
            </div>
            <div className="flex justify-between text-[13px] border-t border-border pt-2">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-[15px]">{formatCurrency(grandTotal)}</span>
            </div>
            {!onlinePayment && (
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Change</span>
                <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                  {formatCurrency(change)}
                </span>
              </div>
            )}
            {!onlinePayment && grandTotal > 0 && (
              <div className={`text-[11px] px-2 py-1.5 rounded-lg text-center font-medium
                ${hasCashShortage
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-green-50 border border-green-200 text-green-700'}`}>
                {hasCashShortage
                  ? `Still due: ${formatCurrency(grandTotal - receivedCash)}`
                  : '✓ Cash sufficient'}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        size="lg"
        disabled={loading || (hasCashShortage && !onlinePayment) || !hasItems || hasStockIssues}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
        ) : (
          'Submit Order'
        )}
      </Button>
    </form>
  );
}
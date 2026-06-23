'use client';

import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Package, ImagePlus, Loader2, DollarSign, Tag, Box, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSchema } from "@/src/schema/schema";
import { CreateProduct } from "@/src/api/product";
import { FetchCategories } from "@/src/api/category";
import { Category } from "@/src/types/types";

type ProductFormValues = z.infer<typeof ProductSchema>;

const METRICS = ["pcs", "kg", "g", "L", "mL", "box", "pack", "bag", "bottle", "pair", "meter", "piece", "can", "set"];

interface ProductFormProps {
  onSuccess?: () => void;
  isInDialog?: boolean;
  onCancel?: () => void;
}

function FieldItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function FieldErr({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null;
  return (
    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {errors.map((e) => (typeof e === "string" ? e : (e as { message: string }).message)).join(", ")}
    </p>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-border">
      {Icon && <Icon className="w-4 h-4 text-amber-500" />}
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}

export default function ProductForm({ onSuccess, isInDialog, onCancel }: ProductFormProps) {
  const router = useRouter();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await FetchCategories();
      return res.data as Category[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: createProduct, isPending } = useMutation({
    mutationFn: (values: ProductFormValues) => CreateProduct(values),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create product", error);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: 0,
      imageUrl: "",
      quantity: 0,
      minQuantity: 0,
      originalPrice: 0,
      sellingPrice: 0,
      metric: "",
    },
    validators: { onSubmit: ProductSchema },
    onSubmit: async ({ value }) => {
      await createProduct(value as ProductFormValues);
    },
  });

  const original = useStore(form.store, (s) => s.values.originalPrice);
  const selling = useStore(form.store, (s) => s.values.sellingPrice);
  const profit = selling - original;
  const margin = original > 0 ? (((selling - original) / original) * 100).toFixed(1) : null;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full">
      <div className={isInDialog ? "w-full space-y-5" : "w-full max-w-7xl mx-auto px-6 py-10 space-y-6"}>
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-[17px] font-semibold text-foreground tracking-tight">Add Product</h1>
              <p className="text-[12px] text-muted-foreground">Fill in the details to create a new product</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* ── Basic info ── */}
          <section className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
            <SectionHeader title="Basic Information" icon={Tag} />

            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldItem>
                    <Label htmlFor={field.name} className="text-[13px] font-medium text-foreground/80">
                      Product Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter product name (e.g. Bamboo Cutting Board)"
                      className={`h-10 text-[13px] rounded-lg w-full transition-all ${
                        isInvalid 
                          ? "border-red-400 focus-visible:ring-red-400/30" 
                          : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                      }`}
                    />
                    <FieldErr errors={field.state.meta.errors} />
                  </FieldItem>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="categoryId">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Category <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        disabled={categoriesLoading}
                        value={field.state.value ? String(field.state.value) : ""}
                        onValueChange={(val) => field.handleChange(Number(val))}
                      >
                        <SelectTrigger
                          className={`h-10 text-[13px] rounded-lg w-full transition-all ${
                            isInvalid 
                              ? "border-red-400" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)} className="text-[13px]">
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>

              <form.Field name="metric">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Unit / Metric <span className="text-red-400">*</span>
                      </Label>
                      <Select value={field.state.value} onValueChange={field.handleChange}>
                        <SelectTrigger
                          className={`h-10 text-[13px] rounded-lg w-full transition-all ${
                            isInvalid 
                              ? "border-red-400" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Select unit of measurement" />
                        </SelectTrigger>
                        <SelectContent>
                          {METRICS.map((m) => (
                            <SelectItem key={m} value={m} className="text-[13px]">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>
            </div>

            {/* ── Image URL ── */}
            <form.Field name="imageUrl">
              {(field) => (
                <FieldItem>
                  <Label className="text-[13px] font-medium text-foreground/80">
                    Image URL <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Paste image URL (e.g. https://example.com/image.jpg)"
                      className="h-10 text-[13px] rounded-lg w-full pl-9 transition-all focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                    />
                  </div>
                </FieldItem>
              )}
            </form.Field>
          </section>

          {/* ── Stock levels ── */}
          <section className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
            <SectionHeader title="Stock Levels" icon={Box} />

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="quantity">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Current Quantity <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min={0}
                          id={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                          placeholder="Enter current stock count"
                          className={`h-10 text-[13px] rounded-lg w-full pl-9 transition-all ${
                            isInvalid 
                              ? "border-red-400 focus-visible:ring-red-400/30" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                        />
                      </div>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>

              <form.Field name="minQuantity">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Minimum Quantity
                        <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                          Triggers low stock alert when reached
                        </span>
                      </Label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min={0}
                          id={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                          placeholder="Set minimum stock threshold"
                          className={`h-10 text-[13px] rounded-lg w-full pl-9 transition-all ${
                            isInvalid 
                              ? "border-red-400 focus-visible:ring-red-400/30" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                        />
                      </div>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>
            </div>
          </section>

          {/* ── Pricing ── */}
          <section className="bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
            <SectionHeader title="Pricing" icon={DollarSign} />

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="originalPrice">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Cost Price <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-muted-foreground">₱</span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          id={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                          placeholder="Enter cost price"
                          className={`h-10 text-[13px] rounded-lg w-full pl-7 transition-all ${
                            isInvalid 
                              ? "border-red-400 focus-visible:ring-red-400/30" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                        />
                      </div>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>

              <form.Field name="sellingPrice">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px] font-medium text-foreground/80">
                        Selling Price <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-medium text-muted-foreground">₱</span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          id={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : 0)}
                          placeholder="Enter selling price"
                          className={`h-10 text-[13px] rounded-lg w-full pl-7 transition-all ${
                            isInvalid 
                              ? "border-red-400 focus-visible:ring-red-400/30" 
                              : "focus-visible:ring-amber-400/30 focus-visible:border-amber-400"
                          }`}
                        />
                      </div>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>
            </div>

            {/* Live margin indicator */}
            {margin !== null && (
              <div className={`grid grid-cols-3 gap-3 p-4 rounded-xl border text-center transition-all ${
                Number(margin) >= 0 
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
                  : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
              }`}>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Margin</p>
                  <p className={`text-[16px] font-bold ${Number(margin) >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {Number(margin) >= 0 ? "+" : ""}{margin}%
                  </p>
                </div>
                <div className="border-x border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Profit / Unit</p>
                  <p className={`text-[16px] font-bold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    ₱{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Markup</p>
                  <p className={`text-[16px] font-bold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {original > 0 ? `${((profit / original) * 100).toFixed(1)}%` : "—"}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 px-5 rounded-lg text-[13px] font-medium hover:bg-muted/80 transition-all"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-10 px-6 rounded-lg text-[13px] font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-60"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
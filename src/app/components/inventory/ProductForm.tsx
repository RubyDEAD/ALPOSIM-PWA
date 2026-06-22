'use client';

import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Package, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";

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

// ── Schema ────────────────────────────────────────────────────────────────────



type ProductFormValues = z.infer<typeof ProductSchema>;

const METRICS = ["pcs", "kg", "g", "L", "mL", "box", "pack", "bag", "bottle", "pair"];

// ── Reusable field wrapper ────────────────────────────────────────────────────

function FieldItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function FieldErr({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null;
  return (
    <p className="text-[11px] text-red-500">
      {errors.map((e) => (typeof e === "string" ? e : (e as { message: string }).message)).join(", ")}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/inventory");
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
    validators: {
      onSubmit: ProductSchema,
    },
    onSubmit: async ({ value }) => {
      await createProduct(value as ProductFormValues);
    },
  });

  const original = useStore(form.store, (s) => s.values.originalPrice);
  const selling = useStore(form.store, (s) => s.values.sellingPrice);
  const margin = original > 0 ? (((selling - original) / original) * 100).toFixed(1) : null;

  return (
    <div className="max-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/inventory">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-foreground">Add product</h1>
              <p className="text-[12px] text-muted-foreground">Fill in the details below</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >

          {/* ── Basic info ── */}
          <section className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <h2 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Basic info</h2>

            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldItem>
                    <Label htmlFor={field.name} className="text-[13px]">Product name</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Bamboo Cutting Board"
                      className={`h-9 text-[13px] rounded-lg ${isInvalid ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                    />
                    <FieldErr errors={field.state.meta.errors} />
                  </FieldItem>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-3">
              <form.Field name="categoryId">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px]">Category</Label>
                      <Select
                        disabled={categoriesLoading}
                        value={field.state.value ? String(field.state.value) : ""}
                        onValueChange={(val) => field.handleChange(Number(val))}
                      >
                        <SelectTrigger
                          className={`h-9 text-[13px] rounded-lg ${isInvalid ? "border-red-400" : ""}`}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder={categoriesLoading ? "Loading…" : "Select category"} />
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
                      <Label className="text-[13px]">Unit / metric</Label>
                      <Select value={field.state.value} onValueChange={field.handleChange}>
                        <SelectTrigger
                          className={`h-9 text-[13px] rounded-lg ${isInvalid ? "border-red-400" : ""}`}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {METRICS.map((m) => (
                            <SelectItem key={m} value={m} className="text-[13px]">{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="imageUrl">
              {(field) => (
                <FieldItem>
                  <Label className="text-[13px]">
                    Image URL <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <ImagePlus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                      className="h-9 text-[13px] rounded-lg pl-8"
                    />
                  </div>
                </FieldItem>
              )}
            </form.Field>
          </section>

          {/* ── Stock levels ── */}
          <section className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <h2 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Stock levels</h2>

            <div className="grid grid-cols-2 gap-3">
              <form.Field name="quantity">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px]">Current quantity</Label>
                      <Input
                        type="number"
                        min={0}
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className={`h-9 text-[13px] rounded-lg ${isInvalid ? "border-red-400" : ""}`}
                      />
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
                      <Label className="text-[13px]">
                        Minimum quantity
                        <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                          Triggers low stock alert
                        </span>
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className={`h-9 text-[13px] rounded-lg ${isInvalid ? "border-red-400" : ""}`}
                      />
                      <FieldErr errors={field.state.meta.errors} />
                    </FieldItem>
                  );
                }}
              </form.Field>
            </div>
          </section>

          {/* ── Pricing ── */}
          <section className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <h2 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Pricing</h2>

            <div className="grid grid-cols-2 gap-3">
              <form.Field name="originalPrice">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <FieldItem>
                      <Label className="text-[13px]">Cost price</Label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">₱</span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className={`h-9 text-[13px] rounded-lg pl-6 ${isInvalid ? "border-red-400" : ""}`}
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
                      <Label className="text-[13px]">Selling price</Label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">₱</span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(Number(e.target.value))}
                          className={`h-9 text-[13px] rounded-lg pl-6 ${isInvalid ? "border-red-400" : ""}`}
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
              <div className={`flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg border ${
                Number(margin) >= 0
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}>
                <span className="font-medium">
                  {Number(margin) >= 0 ? "+" : ""}{margin}% margin
                </span>
                <span className="text-muted-foreground">
                  · ₱{(selling - original).toLocaleString(undefined, { minimumFractionDigits: 2 })} per unit
                </span>
              </div>
            )}
          </section>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-2 pb-8">
            <Link href="/inventory">
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg text-[13px]">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-9 px-5 rounded-lg text-[13px] bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              {isPending ? "Saving…" : "Save product"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
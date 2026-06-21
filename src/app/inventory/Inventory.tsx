'use client';

import { useEffect, useState, useMemo } from "react";
import { FetchProducts, DeleteProduct } from "@/src/api/product";
import { FetchCategories } from "@/src/api/category";
import { Product, Category } from "@/src/types/types";

import InventoryFilters from "@/src/app/components/inventory/InventoryFilters";
import ProductTable from "@/src/app/components/inventory/ProductTable";
import LoadingSkeleton from "@/src/app/components/inventory/LoadingSkeleton";
import DeleteModal from "@/src/app/components/inventory/DeleteModal";
import ViewTabs from "@/src/app/components/inventory/ViewTabs";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters — all owned here, passed down as props
  const [search, setSearch] = useState("");
  const [stockLevel, setStockLevel] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");

  // Delete flow
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          FetchProducts(),
          FetchCategories(),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.productCode.toLowerCase().includes(search.toLowerCase());

      const matchStock =
        stockLevel === "All" ||
        (stockLevel === "Low" && product.quantity <= product.minQuantity) ||
        (stockLevel === "Good" && product.quantity > product.minQuantity);

      const matchCategory =
        categoryFilter === "All" || product.categoryId === Number(categoryFilter);

      return matchSearch && matchStock && matchCategory;
    });
  }, [products, search, stockLevel, categoryFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await DeleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-foreground">Inventory</h1>
              <p className="text-[12px] text-muted-foreground">
                {loading ? "Loading…" : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <Link href="/inventory/add">
            <Button size="sm" className="gap-1.5 text-[13px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-8">
              <Plus className="w-3.5 h-3.5" />
              Add product
            </Button>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">

    

            <InventoryFilters
              search={search}
              onSearchChange={setSearch}
              stockLevel={stockLevel}
              onStockLevelChange={setStockLevel}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
            />
          </div>

          {loading ? (
            <LoadingSkeleton rows={8} />
          ) : (
            <ProductTable
              products={filteredProducts}
              categories={categories}
              onDelete={setDeleteId}
            />
          )}
        </div>

      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={deleting}
      />
    </div>
  );
}
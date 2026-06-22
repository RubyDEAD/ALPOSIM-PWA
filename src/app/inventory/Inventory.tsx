'use client';

import { useEffect, useState, useMemo } from "react";
import { FetchProductPaginated, DeleteProduct } from "@/src/api/product";
import { FetchCategories } from "@/src/api/category";
import { Product, Category } from "@/src/types/types";
import ProductForm from "../components/inventory/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InventoryFilters from "@/src/app/components/inventory/InventoryFilters";
import ProductTable from "@/src/app/components/inventory/ProductTable";
import LoadingSkeleton from "@/src/app/components/inventory/LoadingSkeleton";
import DeleteModal from "@/src/app/components/inventory/DeleteModal";
import ViewTabs from "@/src/app/components/inventory/ViewTabs";
import TablePagination from "@/src/app/components/inventory/TablePagination";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LIMIT = 15;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [stockLevel, setStockLevel] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");

  // Delete flow
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productRes, categoryRes] = await Promise.all([
          FetchProductPaginated(page, LIMIT),
          FetchCategories(),
        ]);
        setProducts(productRes.data.items);
        setTotalCount(productRes.data.totalCount);
        setTotalPages(productRes.data.totalPages);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page]); // re-fetch whenever page changes

  // Filtering is done client-side on the current page's products
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
      setTotalCount((prev) => prev - 1);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleting(false);
    }
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => { setSearch(value); setPage(1); };
  const handleStockChange = (value: string) => { setStockLevel(value); setPage(1); };
  const handleCategoryChange = (value: string) => { setCategoryFilter(value); setPage(1); };

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
                {loading ? "Loading…" : `${totalCount} product${totalCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1.5 text-[13px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-8"
              >
                <Plus className="w-10.5 h-3.5" />
                Add product
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl w-[95vw]">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>

              <ProductForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">

            <ViewTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <InventoryFilters
              search={search}
              onSearchChange={handleSearchChange}
              stockLevel={stockLevel}
              onStockLevelChange={handleStockChange}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
              categories={categories}
            />
          </div>

          {loading ? (
            <LoadingSkeleton rows={LIMIT} />
          ) : (
            <ProductTable
              products={filteredProducts}
              categories={categories}
              onDelete={setDeleteId}
            />
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              limit={LIMIT}
              onPageChange={setPage}
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
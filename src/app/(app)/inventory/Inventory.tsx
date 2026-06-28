'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchProductPaginated, DeleteProduct } from "@/src/api/product";
import { FetchCategories } from "@/src/api/category";
import { Product, Category } from "@/src/types/types";
import ProductForm from "../../components/inventory/ProductForm";
import InventoryFilters from "@/src/app/components/inventory/InventoryFilters";
import ProductTable from "@/src/app/components/inventory/ProductTable";
import LoadingSkeleton from "@/src/app/components/inventory/LoadingSkeleton";
import DeleteModal from "@/src/app/components/inventory/DeleteModal";
import ViewTabs from "@/src/app/components/inventory/ViewTabs";
import TablePagination from "@/src/app/components/inventory/TablePagination";
import { Package, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LIMIT = 15;

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const popupRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stockLevel, setStockLevel] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await FetchCategories();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // fetch products
  const { data: productData, isLoading } = useQuery({
    queryKey: ["products", page, stockLevel, categoryFilter, search],
    queryFn: async () => {
      const res = await FetchProductPaginated(page, LIMIT, stockLevel, categoryFilter, search);
      return res.data;
    },
  });

  const products: Product[] = productData?.items ?? [];
  const totalCount: number = productData?.totalCount ?? 0;
  const totalPages: number = productData?.totalPages ?? 1;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.productCode.toLowerCase().includes(search.toLowerCase());

      const matchStock =
        stockLevel === "All" || product.status === stockLevel;

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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (value: string) => { setSearch(value); setPage(1); };
  const handleStockChange = (value: string) => { setStockLevel(value); setPage(1); };
  const handleCategoryChange = (value: string) => { setCategoryFilter(value); setPage(1); };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isPopupOpen]);

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
                {isLoading ? "Loading…" : `${totalCount} product${totalCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Popup Trigger Button */}
          <div className="relative">
            <Button
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>

            {/* Popup Card */}
            {isPopupOpen && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={(e) => {
                  // Only close if clicking the backdrop itself
                  if (e.target === e.currentTarget) {
                    setIsPopupOpen(false);
                  }
                }}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                
                {/* Popup Content */}
                <div
                  ref={popupRef}
                  className="relative z-50 
                    w-[95vw] max-w-6xl max-h-[90vh] 
                    bg-white rounded-2xl shadow-2xl 
                    overflow-y-auto
                    animate-in fade-in-0 zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border px-6 py-4 z-10">
                    <h2 className="text-lg font-semibold">Add Product</h2>
                    <p className="text-sm text-muted-foreground">
                      Fill in the details to add a new product to your inventory.
                    </p>
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <ProductForm
                      isInDialog={true}
                      onCancel={() => setIsPopupOpen(false)}
                      onSuccess={() => {
                        setIsPopupOpen(false);
                        queryClient.invalidateQueries({ queryKey: ["products"] });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />
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

          {isLoading ? (
            <LoadingSkeleton rows={LIMIT} />
          ) : (
            <ProductTable
              products={filteredProducts}
              categories={categories}
              onDelete={setDeleteId}
            />
          )}

          {!isLoading && totalPages > 1 && (
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
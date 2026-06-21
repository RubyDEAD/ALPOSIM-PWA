'use client'

import { useEffect, useState } from "react";
import { FetchProducts, DeleteProduct } from "@/src/api/product";
import { FetchCategories } from "@/src/api/category";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  categoryId: number;
  category?: Category;
  imageUrl: string;
  quantity: number;
  minQuantity: number;
  status: string;
  originalPrice: number;
  sellingPrice: number;
  metric: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  Low: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Normal: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  High: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

export default function InventoryClientPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          FetchProducts(),
          FetchCategories(),
        ]);
        setProducts(productRes.data);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.productCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchCategory =
      categoryFilter === "All" || p.categoryId === Number(categoryFilter);
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await DeleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch {
      console.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono tracking-[0.3em] text-[#f59e0b] uppercase mb-1">
            Stock Management
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        </div>
        <a
          href="/inventory/add"
          className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          + Add Product
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-[#4b5563] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b] w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]"
        >
          <option value="All">All Status</option>
          <option value="Critical">Critical</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-sm text-[#6b7280] self-center">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#6b7280] text-sm">
            Loading inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6b7280]">
            <p className="text-sm">No products found.</p>
            <a href="/inventory/add" className="text-[#f59e0b] text-sm mt-2 hover:underline">
              Add your first product
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[#6b7280] text-xs uppercase tracking-widest">
                <th className="text-left px-6 py-4">Code</th>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Qty</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Selling</th>
                <th className="text-left px-6 py-4">Metric</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-[#2a2a2a] hover:bg-[#222222] transition ${
                    i === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-[#f59e0b] text-xs">
                    {product.productCode}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-[#9ca3af]">
                    {categories.find((c) => c.id === product.categoryId)?.name ?? "—"}
                  </td>
                
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[product.status] ?? ""}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#9ca3af]">
                    ₱{product.originalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₱{product.sellingPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-[#6b7280] text-xs">{product.metric}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <a
                        href={`/inventory/${product.id}/edit`}
                        className="text-xs px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg transition"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">Delete product?</h2>
            <p className="text-[#6b7280] text-sm mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-[#2a2a2a] hover:bg-[#333333] text-white py-2.5 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-900 text-white py-2.5 rounded-lg text-sm transition"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
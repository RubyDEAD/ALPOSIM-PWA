import { Calendar, Columns, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/src/types/types";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  stockLevel: string;
  onStockLevelChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  onManageColumns?: () => void;
}

const STOCK_OPTIONS = ["All", "Critical", "Low", "Normal", "High"];

export default function InventoryFilters({
  search,
  onSearchChange,
  stockLevel,
  onStockLevelChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onManageColumns,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products…"
          className="pl-8 h-8 text-[12px] w-48 rounded-lg border-border bg-white"
        />
      </div>

      {/* Category */}
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-8 text-[12px] w-36 rounded-lg border-border font-normal">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="text-[12px]">All categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)} className="text-[12px]">
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stock level toggle */}
      <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/30">
        {STOCK_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onStockLevelChange(option)}
            className={`text-[12px] px-2.5 py-1 rounded-md transition-all font-normal ${
              stockLevel === option
                ? "bg-white text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

  

    </div>
  );
}
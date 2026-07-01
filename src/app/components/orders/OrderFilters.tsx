import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Wifi, Banknote, LayoutList, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  paymentFilter: "all" | "cash" | "online";
  onPaymentFilterChange: (value: "all" | "cash" | "online") => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClearFilters?: () => void;
}

export function OrderFilters({
  search,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: OrderFiltersProps) {
  const hasFilters = search || startDate || endDate || paymentFilter !== "all";

  const handleClear = () => {
    onSearchChange("");
    onStartDateChange("");
    onEndDateChange("");
    onPaymentFilterChange("all");
    onClearFilters?.();
  };

  return (
    <div className="space-y-3 bg-white-200 dark:bg-gray-900 rounded-xl border  dark:border-gray-700 p-4 ">
    
      <div className="flex flex-wrap items-center gap-2">
    
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" />
          <Input
            placeholder="Search by sale code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-9 h-9 text-sm rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "transition-all duration-200"
            )}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date filters with labels */}
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={cn(
                "pl-8 h-8 text-xs w-[140px] rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "transition-all duration-200",
                !startDate && "text-gray-400 dark:text-gray-500"
              )}
            />
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-1">to</span>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={cn(
                "pl-8 h-8 text-xs w-[140px] rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "transition-all duration-200",
                !endDate && "text-gray-400 dark:text-gray-500"
              )}
            />
          </div>
        </div>

        {/* Payment filter pills - Modern design */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          {(["all", "cash", "online"] as const).map((option) => {
            const Icon = option === "all" ? LayoutList : option === "cash" ? Banknote : Wifi;
            const isActive = paymentFilter === option;
            
            return (
              <button
                key={option}
                onClick={() => onPaymentFilterChange(option)}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-200",
                  "font-medium",
                  isActive
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 border border-gray-200 dark:border-gray-700"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-900/50"
                )}
              >
                <Icon className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                )} />
                <span>{option === "all" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Clear filters button */}
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-8 px-2.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 gap-1 border-gray-200 dark:border-gray-700"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Active filters:</span>
          
          {search && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              Search: {search}
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-primary/70 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {startDate && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
              From: {new Date(startDate).toLocaleDateString()}
            </span>
          )}
          
          {endDate && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
              To: {new Date(endDate).toLocaleDateString()}
            </span>
          )}
          
          {paymentFilter !== "all" && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 capitalize">
              {paymentFilter}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
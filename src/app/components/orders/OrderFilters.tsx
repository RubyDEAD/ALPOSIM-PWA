import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  paymentFilter: "all" | "cash" | "online";
  onPaymentFilterChange: (
    value: "all" | "cash" | "online"
  ) => void;

  startDate: string;
  endDate: string;

  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
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
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 md:flex-row md:flex-wrap md:items-end">
      {/* Search */}
      <div className="flex-1 min-w-[240px]">
        <label className="mb-2 block text-sm font-medium">
          Search Order
        </label>

        <Input
          placeholder="Search by sale code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Start Date
        </label>

        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      {/* End Date */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          End Date
        </label>

        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      {/* Payment */}
      <div className="w-full md:w-48">
        <label className="mb-2 block text-sm font-medium">
          Payment
        </label>

        <Select
          value={paymentFilter}
          onValueChange={(value) =>
            onPaymentFilterChange(
              value as "all" | "cash" | "online"
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
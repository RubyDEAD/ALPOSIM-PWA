'use client'

import { useQuery } from "@tanstack/react-query";
import { FetchProductHistory} from "@/src/api/productHistory";
import { FetchProductbyId } from "@/src/api/product";
import { ProductHistory } from "@/src/types/types";
import HistoryHeader from "@/src/app/components/productHistory/HistoryHeader";
import HistorySummaryCards from "@/src/app/components/productHistory/HistorySummaryCards";
import HistoryTimeline from "@/src/app/components/productHistory/HistoryTimeline";

interface Props {
  id: string;
}

export default function ProductHistoryPageClient({ id }: Props) {
  const { data: history = [], isLoading: historyLoading } = useQuery<ProductHistory[]>({
    queryKey: ["product-history", id],
    queryFn: async () => {
      const res = await FetchProductHistory(id);
      return res.data;
    },
  });

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await FetchProductbyId(id);
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <HistoryHeader
          productName={product?.name ?? "Product"}
          productCode={product?.productCode ?? ""}
          totalChanges={history.length}
        />
        <HistorySummaryCards history={history} />
        <HistoryTimeline history={history} isLoading={historyLoading} />
      </div>
    </div>
  );
}
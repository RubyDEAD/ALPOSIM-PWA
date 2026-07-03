'use client';

import { useEffect, useState } from 'react';
import { FetchProductHistory } from '@/src/api/productHistory';
import { FetchProductbyId } from '@/src/api/product';
import { ProductHistory, Product } from '@/src/types/types';

import HistoryHeader from '@/src/app/components/productHistory/HistoryHeader';
import HistorySummaryCards from '@/src/app/components/productHistory/HistorySummaryCards';
import HistoryTimeline from '@/src/app/components/productHistory/HistoryTimeline';

export default function ProductHistoryPageClient({ id }: { id: string }) {
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [historyRes, productRes] = await Promise.all([
          FetchProductHistory(id),
          FetchProductbyId(id),
        ]);
        setHistory(historyRes.data);
        setProduct(productRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-1">
          <p className="text-[13px] font-medium text-foreground">Failed to load history</p>
          <p className="text-[12px] text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        <HistoryHeader
          productName={product?.name ?? '—'}
          productCode={product?.productCode ?? '—'}
          totalChanges={history.length}
        />

        <HistorySummaryCards history={history} />

        <HistoryTimeline history={history} isLoading={loading} />

      </div>
    </div>
  );
}
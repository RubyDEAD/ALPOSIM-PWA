'use client';

import { useEffect, useState } from 'react';
import {
  FetchSalesPaginated,
  DeleteSale,
  FetchSales,
  CreateSale,
} from '@/src/api/sale';
import { Sale, Product } from '@/src/types/types';
import { SaleInput } from '@/src/schema/schema';
import { FetchProducts } from '@/src/api/product';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  OrderSummaryCards,
  OrderFilters,
  OrderTable,
  OrderDetailsDialog,
  DeleteOrderDialog,
} from '@/src/app/components/orders';
import OrderActionBar from '@/src/app/components/orders/OrderActionBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrderForm } from '../../components/orders/OrderForm';
import TablePagination from '@/src/app/components/inventory/TablePagination';
export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 15;
  const [products, setProducts] = useState<Product[]>([]);
  const [createLoading, setCreateLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<
    'all' | 'cash' | 'online'
  >('all');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const payment =
    paymentFilter === "all"
      ? undefined
      : paymentFilter === "online";

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "sales",
      page,
      limit,
      search,
      payment,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const response = await FetchSalesPaginated(
        page,
        limit,
        search,
        payment,
        startDate,
        endDate
      );

      return response.data;
    },
  });

  const orders = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const fetchProducts = async () => {
    try {
        const response = await FetchProducts();
        setProducts(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrder = async (data: SaleInput) => {
    setCreateLoading(true);

    try {
      await CreateSale(data);

      setAddOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSale) return;

    setDeleteLoading(true);

    try {
      await DeleteSale(selectedSale.id);

      setDeleteOpen(false);
      setSelectedSale(null);

      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const {data: allOrders = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: async () =>{
      const response = await FetchSales();
      return response.data; 
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="space-y-6 min-h-screen">
      <OrderActionBar
        onAddOrder={() => setAddOpen(true)}
        totalOrders={totalCount}
      />
  
      <OrderSummaryCards orders={allOrders} />
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="max-w-10xl mx-auto px-2 sm:px-6 lg:px-8 py-8 space-y-6">
        <OrderTable
          orders={orders}
          loading={isLoading}
          onView={handleView}
          onDelete={handleDeleteClick}
        />

        {!isLoading && totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={limit}
          onPageChange={setPage}
        />
      )}

        <OrderDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          sale={selectedSale}
        />

        <DeleteOrderDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          sale={selectedSale}
          loading={deleteLoading}
          onDelete={handleDelete}
        />

        {/* Add Order Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            <OrderForm
              key={addOpen ? "open" : "closed"}
              loading={createLoading}
              onSubmit={handleCreateOrder}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
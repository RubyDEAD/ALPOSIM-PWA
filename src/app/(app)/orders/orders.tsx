'use client';

import { useEffect, useMemo, useState } from 'react';

import { FetchSales, DeleteSale, CreateSale } from '@/src/api/sale';
import { Sale, Product } from '@/src/types/types';
import { SaleInput } from '@/src/schema/schema';
import { FetchProducts } from '@/src/api/product';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await FetchSales();
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
        const response = await FetchProducts();
        setProducts(response.data);
    } catch (error) {
        console.error(error);
    }
};

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleCreateOrder = async (data: SaleInput) => {
  setCreateLoading(true);

  try {
    await CreateSale(data);

    setAddOpen(false);

    await fetchOrders();
  } catch (error) {
    console.error(error);
  } finally {
    setCreateLoading(false);
  }
};


  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.saleCode
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === 'all'
          ? true
          : paymentFilter === 'online'
          ? order.onlinePayment
          : !order.onlinePayment;

      const orderDate = new Date(order.createdAt);

      const matchesStart = startDate
        ? orderDate >= new Date(startDate)
        : true;

      const matchesEnd = endDate
        ? orderDate <= new Date(endDate + 'T23:59:59')
        : true;

      return (
        matchesSearch &&
        matchesPayment &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [orders, search, paymentFilter, startDate, endDate]);

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

      await fetchOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <OrderActionBar
        onAddOrder={() => setAddOpen(true)}
        totalOrders={filteredOrders.length}
      />
  
    <OrderSummaryCards orders={filteredOrders} />
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
        orders={filteredOrders}
        loading={loading}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

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
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            <OrderForm
            key={addOpen ? "open" : "closed"}
            products={products}
            loading={createLoading}
            onSubmit={handleCreateOrder}
            />
        </DialogContent>
    </Dialog>
    </div>
    </div>
  );
}
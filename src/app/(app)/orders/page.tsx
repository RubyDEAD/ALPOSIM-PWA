import {Metadata} from 'next';
import OrdersPage from '@/src/app/(app)/orders/orders'

export const metadata: Metadata = {
    title: 'Orders for ALPOSIM',
    description: 'Orders for ALPOSIM',
}

export default function Orders(){
    return <OrdersPage />;
}

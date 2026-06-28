import {Metadata} from "next";
import ProductHistoryPageClient from "./ProductHistory";

const metadata: Metadata = {
    title: "Product History",
    description: "This is the product history page of the application.",
}

export default function ProductHistoryPage({ params }: { params: { id: string } }) {
    return <ProductHistoryPageClient id={params.id} />;
}
import { Metadata } from "next";
import ProductHistoryPageClient from "./ProductHistory";

export const metadata: Metadata = {
    title: "Product History",
    description: "This is the product history page of the application.",
}

export default async function ProductHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    // Await the params promise to get the id
    const { id } = await params;
    return <ProductHistoryPageClient id={id} />;
}
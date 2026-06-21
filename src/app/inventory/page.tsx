import { Metadata } from "next";
import InventoryClientPage from "../inventory/Inventory";


export const metedata: Metadata = {
    title: 'Product Inventory',
    description: 'Manage Products Here'
}

export default function InventoryPage(){
    return <InventoryClientPage/>;
}
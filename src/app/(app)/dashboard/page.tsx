import { Metadata } from "next";
import DashboardPageClient from "./dashboard";
const metadata: Metadata = {
    title: "Dashboard Page for Alposim",
    description: "Overview Page"
}

export default function Dashboard(){
    return <DashboardPageClient/>;
}

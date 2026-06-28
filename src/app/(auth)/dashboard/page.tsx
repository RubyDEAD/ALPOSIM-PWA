import { Metadata } from "next";
import DashboardPageClient from "./Dashboard";

const metadata: Metadata = {
    title: "Welcome to Dashboard",
    description: "This is the dashboard page of the application.",
}

export default function DashboardPage() {
    return <DashboardPageClient />;
}


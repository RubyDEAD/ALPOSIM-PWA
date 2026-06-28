// src/app/components/Sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, ShoppingCart, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 border-r border-border bg-white flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <span className="text-[15px] font-semibold tracking-tight">Alposim</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                active
                  ? "bg-amber-50 text-amber-600 font-medium"
                  : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-amber-500" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
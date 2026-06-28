'use client'

import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

interface Props {
  productName: string;
  productCode: string;
  totalChanges: number;
}

export default function HistoryHeader({ productName, productCode, totalChanges }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Link href="/inventory">
        <button className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-gray-50 transition">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      </Link>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
          <Package className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">
            {productName} — History
          </h1>
          <p className="text-[12px] text-muted-foreground">
            {productCode} · {totalChanges} change{totalChanges !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
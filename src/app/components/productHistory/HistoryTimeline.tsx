'use client'

import { Clock, RefreshCw } from "lucide-react";
import { ProductHistory } from "@/src/types/types";
import HistoryCard from "./HistoryCard";

interface Props {
  history: ProductHistory[];
  isLoading: boolean;
}

export default function HistoryTimeline({ history, isLoading }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
          Change log
        </h2>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-border flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-xl border border-border flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Clock className="w-10 h-10 text-border mb-3" />
          <p className="text-[13px] font-medium">No changes recorded yet</p>
          <p className="text-[12px] mt-1">Changes will appear here when the product is updated.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tab {
  label: string;
  value: string;
}

interface ViewTabsProps {
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onViewSettings?: () => void;
}

const DEFAULT_TABS: Tab[] = [{ label: "All products", value: "all" }];

export default function ViewTabs({
  tabs = DEFAULT_TABS,
  activeTab = "all",
  onTabChange,
  onViewSettings,
}: ViewTabsProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-0">
      <div className="flex items-center gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange?.(tab.value)}
            className={`text-[13px] pb-2.5 px-0.5 transition-colors border-b-2 ${
              activeTab === tab.value
                ? "font-medium text-foreground border-foreground"
                : "font-normal text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button className="text-[13px] text-muted-foreground hover:text-foreground pb-2.5 transition-colors border-b-2 border-transparent">
          + View
        </button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onViewSettings}
        className="text-muted-foreground gap-1.5 h-auto pb-2.5 text-[12px]"
      >
      
      </Button>
    </div>
  );
}
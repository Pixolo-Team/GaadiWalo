// TYPES //
import type { SalesLeadDetailsTabData } from "@/types/leads";

interface LeadDetailsTabsPropsData {
  onChange: (tab: SalesLeadDetailsTabData) => void;
  selectedTab: SalesLeadDetailsTabData;
  tabs: ReadonlyArray<SalesLeadDetailsTabData>;
}

/**
 * Renders segmented tabs for lead detail sections.
 */
export function LeadDetailsTabs({
  onChange,
  selectedTab,
  tabs,
}: LeadDetailsTabsPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="bg-n-100 flex rounded-[10px] p-0">
      {/* Lead detail tab list */}
      {tabs.map((tabItem) => {
        const isSelected = selectedTab === tabItem;

        return (
          /* Lead detail tab */
          <button
            key={tabItem}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(tabItem)}
            className={`font-secondary flex-1 rounded-[7px] px-1 py-2.5 text-sm ${
              isSelected
                ? "bg-n-50 font-semibold text-blue-600"
                : "text-n-600 font-medium"
            }`}
          >
            {tabItem}
          </button>
        );
      })}
    </div>
  );
}

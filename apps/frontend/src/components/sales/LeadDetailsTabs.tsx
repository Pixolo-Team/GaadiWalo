"use client";

// TYPES //
import type { SalesLeadDetailsTabData } from "@/types/leads";

// COMPONENTS //
import Motion from "@/components/animations/Motion";

// UTILS //
import { pressTap } from "@/lib/animations";

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
          <Motion
            as="button"
            key={tabItem}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(tabItem)}
            whileTap={pressTap}
            className={`font-secondary relative flex-1 rounded-[7px] px-1 py-2.5 text-sm transition-colors ${
              isSelected
                ? "font-semibold text-blue-600"
                : "text-n-600 font-medium"
            }`}
          >
            {/* Sliding active pill — layoutId drives the shared spring transition */}
            {isSelected ? (
              <Motion
                as="span"
                layoutId="lead-tab-pill"
                className="bg-n-50 absolute inset-0 rounded-[7px]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}

            {/* Tab label sits above the pill */}
            <span className="relative z-10">{tabItem}</span>
          </Motion>
        );
      })}
    </div>
  );
}

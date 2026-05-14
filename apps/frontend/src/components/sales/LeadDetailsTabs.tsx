interface LeadDetailsTabsPropsData {
  onChange: (tab: string) => void;
  selectedTab: string;
  tabs: ReadonlyArray<string>;
}

/**
 * Renders segmented tabs for lead detail sections.
 */
export function LeadDetailsTabs({
  onChange,
  selectedTab,
  tabs,
}: Readonly<LeadDetailsTabsPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex rounded-[10px] bg-n-100 p-0">
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
            className={`flex-1 rounded-[7px] px-1 py-2.5 font-secondary text-sm ${
              isSelected
                ? "bg-n-50 font-semibold text-blue-600"
                : "font-medium text-n-600"
            }`}
          >
            {tabItem}
          </button>
        );
      })}
    </div>
  );
}

interface PhaseTabItemData {
  count: number;
  key: string;
  label: string;
}

interface PhaseTabsPropsData {
  activeKey: string;
  tabs: ReadonlyArray<PhaseTabItemData>;
}

/**
 * Renders horizontal lead phase tabs.
 */
export function PhaseTabs({ activeKey, tabs }: Readonly<PhaseTabsPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {/* Leads phase tabs list */}
      {tabs.map((tabItem) => {
        const isActive = tabItem.key === activeKey;

        return (
          /* Lead phase tab */
          <button
            key={tabItem.key}
            type="button"
            className={`flex min-w-24 flex-col items-center rounded-xl border-2 p-2.5 ${
              isActive ? "bg-n-50 border-blue-600" : "border-n-50 bg-n-50"
            }`}
          >
            {/* Phase count */}
            <span className="text-n-800 text-xl font-bold">
              {tabItem.count}
            </span>

            {/* Phase label */}
            <span className="font-secondary text-n-600 text-xs">
              {tabItem.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

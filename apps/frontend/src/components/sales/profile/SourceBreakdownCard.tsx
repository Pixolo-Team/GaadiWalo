interface SourceBreakdownItemData {
  colorClassName: string;
  count: number;
  key: string;
  source: string;
}

interface SourceBreakdownCardPropsData {
  items: ReadonlyArray<SourceBreakdownItemData>;
}

/** Renders source breakdown list card. */
export default function SourceBreakdownCard({
  items,
}: SourceBreakdownCardPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col gap-1.5">
      {/* Section title */}
      <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
        Source Breakdown
      </p>

      {/* Source breakdown card */}
      <div className="bg-n-50 rounded-[14px] p-5">
        {/* Source rows */}
        <div className="flex flex-col gap-3">
          {items.map((sourceItem, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={sourceItem.key} className="flex flex-col gap-3">
                {/* Source row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${sourceItem.colorClassName} size-[9px] rounded-[4.5px]`}
                    />
                    <p className="font-secondary text-n-600 text-xs">
                      {sourceItem.source}
                    </p>
                  </div>
                  <p className="font-secondary text-n-950 text-xs font-semibold">
                    {sourceItem.count}
                  </p>
                </div>

                {/* Row divider */}
                {isLast ? null : <div className="bg-n-200 h-px w-full" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

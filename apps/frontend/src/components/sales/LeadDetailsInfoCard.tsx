interface LeadDetailsInfoRowData {
  isHighlighted: boolean;
  key: string;
  label: string;
  value: string;
}

interface LeadDetailsInfoCardPropsData {
  rows: ReadonlyArray<LeadDetailsInfoRowData>;
  title: string;
}

/**
 * Renders a reusable lead details key-value card.
 */
export function LeadDetailsInfoCard({
  rows,
  title,
}: Readonly<LeadDetailsInfoCardPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col gap-4 rounded-[14px] bg-n-50 p-5">
      {/* Card title */}
      <p className="font-secondary text-xs font-bold tracking-[0.5px] text-n-600 uppercase">
        {title}
      </p>

      {/* Info rows */}
      <div className="flex flex-col gap-3">
        {rows.map((rowItem, rowIndex) => (
          /* Info row */
          <div key={rowItem.key} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-secondary text-sm text-n-700">
                {rowItem.label}
              </p>
              <p
                className={`text-right font-secondary text-sm font-medium ${
                  rowItem.isHighlighted ? "text-blue-600" : "text-n-800"
                }`}
              >
                {rowItem.value}
              </p>
            </div>

            {/* Info divider */}
            {rowIndex < rows.length - 1 ? (
              <span className="h-px w-full bg-n-200" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

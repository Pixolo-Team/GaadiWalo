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
}: LeadDetailsInfoCardPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="bg-n-50 flex flex-col gap-4 rounded-[14px] p-5">
      {/* Card title */}
      <p className="font-secondary text-n-600 text-xs font-bold tracking-[0.5px] uppercase">
        {title}
      </p>

      {/* Info rows */}
      <div className="flex flex-col gap-3">
        {rows.map((rowItem, rowIndex) => (
          /* Info row */
          <div key={rowItem.key} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-secondary text-n-700 text-sm">
                {rowItem.label}
              </p>
              <p
                className={`font-secondary text-right text-sm font-medium ${
                  rowItem.isHighlighted ? "text-blue-600" : "text-n-800"
                }`}
              >
                {rowItem.value}
              </p>
            </div>

            {/* Info divider */}
            {rowIndex < rows.length - 1 ? (
              <span className="bg-n-200 h-px w-full" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

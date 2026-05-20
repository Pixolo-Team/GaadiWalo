interface PipelineProgressItemData {
  colorClassName: string;
  count: number;
  key: string;
  label: string;
  progress: number;
}

interface PipelineProgressCardPropsData {
  items: ReadonlyArray<PipelineProgressItemData>;
}

/** Renders pipeline progress rows for performance screen. */
export default function PipelineProgressCard({
  items,
}: PipelineProgressCardPropsData) {
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
        Pipeline Progress
      </p>

      {/* Pipeline card */}
      <div className="bg-n-50 rounded-[14px] p-5">
        {/* Pipeline rows */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.key} className="flex flex-col gap-1">
              {/* Pipeline row header */}
              <div className="flex items-center justify-between">
                <p className="font-secondary text-n-600 text-xs">{item.label}</p>
                <p
                  className={`font-secondary text-xs font-bold ${item.key === "won" ? "text-green-500" : "text-n-950"}`}
                >
                  {item.count}
                </p>
              </div>

              {/* Pipeline row progress */}
              <div className="bg-n-200 h-[5px] w-full rounded-[3px]">
                <div
                  className={`${item.colorClassName} h-[5px] rounded-[3px]`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

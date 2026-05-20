interface WeeklyCallsLeadsItemData {
  calls: number;
  day: string;
  key: string;
  leads: number;
}

interface WeeklyCallsLeadsCardPropsData {
  items: ReadonlyArray<WeeklyCallsLeadsItemData>;
}

/** Renders weekly calls vs leads bar chart card. */
export default function WeeklyCallsLeadsCard({
  items,
}: WeeklyCallsLeadsCardPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const maxWeeklyValue = Math.max(
    ...items.flatMap((dayItem) => [dayItem.calls, dayItem.leads]),
  );

  // Use Effects

  return (
    <div className="flex flex-col gap-1.5">
      {/* Section title */}
      <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
        Weekly Calls vs Leads
      </p>

      {/* Weekly chart card */}
      <div className="bg-n-50 rounded-[14px] p-5">
        {/* Weekly chart */}
        <div className="flex h-[150px] items-end justify-between gap-2">
          {items.map((dayItem) => {
            const callsHeight = (dayItem.calls / maxWeeklyValue) * 100;
            const leadsHeight = (dayItem.leads / maxWeeklyValue) * 100;

            return (
              <div key={dayItem.key} className="flex flex-1 flex-col items-center gap-2">
                {/* Bars */}
                <div className="flex h-[120px] items-end gap-1">
                  <div
                    className="w-2 rounded-t-sm bg-blue-200"
                    style={{ height: `${callsHeight}%` }}
                  />
                  <div
                    className="w-2 rounded-t-sm bg-blue-600"
                    style={{ height: `${leadsHeight}%` }}
                  />
                </div>

                {/* Day label */}
                <p className="font-secondary text-n-500 text-[10px]">{dayItem.day}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

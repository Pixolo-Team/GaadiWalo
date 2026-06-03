interface LeadNoteData {
  author: string;
  key: string;
  message: string;
  meta: string;
  variant: "incoming" | "outgoing";
}

interface NotesTabPropsData {
  notes: ReadonlyArray<LeadNoteData>;
}

/** Lead Notes Tab — displays note bubbles only. Input bar lives in the page layout. */
export function NotesTab({ notes }: NotesTabPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col">
      {/* Notes list */}
      <div className="flex flex-col gap-3 py-3">
        {notes.map((noteItem) => {
          const isOutgoing = noteItem.variant === "outgoing";

          return (
            /* Note item */
            <div
              key={noteItem.key}
              className={`flex w-full flex-col ${
                isOutgoing ? "items-end" : "items-start"
              }`}
            >
              {/* Note bubble group */}
              <div
                className={`flex w-full max-w-[280px] flex-col gap-1 ${
                  isOutgoing ? "items-end" : "items-start"
                }`}
              >
                {/* Note bubble */}
                <div
                  className={`w-full rounded-tr-xl rounded-b-xl px-3.5 py-3.5 ${
                    isOutgoing
                      ? "bg-blue-100 text-blue-800"
                      : "bg-n-50 text-n-800"
                  }`}
                >
                  <p className="font-secondary text-sm leading-[1.4]">
                    {noteItem.message}
                  </p>
                </div>

                {/* Note meta */}
                <p
                  className={`font-secondary text-n-500 text-xs ${
                    isOutgoing ? "text-right" : "text-left"
                  }`}
                >
                  {noteItem.author} · {noteItem.meta}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

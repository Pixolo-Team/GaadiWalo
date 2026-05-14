// COMPONENTS //
import MailSendEmailMessage from "@/components/icons/neevo-icons/MailSendEmailMessage";

interface LeadNoteData {
  author: string;
  key: string;
  message: string;
  meta: string;
  variant: "incoming" | "outgoing";
}

interface LeadNotesPanelPropsData {
  notes: ReadonlyArray<LeadNoteData>;
}

/**
 * Renders the lead notes tab with sticky note composer.
 */
export function LeadNotesPanel({ notes }: Readonly<LeadNotesPanelPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex min-h-[660px] flex-col pb-24">
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
                  className={`w-full rounded-b-xl rounded-tr-xl px-3.5 py-3.5 ${
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
                  className={`font-secondary text-xs text-n-500 ${
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

      {/* Sticky note input */}
      <div className="fixed right-1/2 bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-n-200 bg-n-50 px-3.5 pt-4 pb-5">
        <div className="flex min-h-14 items-center gap-2 rounded-[32px] border border-n-200 bg-n-50 py-2 pr-2 pl-4">
          {/* Note input */}
          <input
            type="text"
            aria-label="Add a note about this lead"
            placeholder="Add a note about this lead..."
            className="min-w-0 flex-1 bg-transparent font-secondary text-sm text-n-800 placeholder:text-n-400 focus:outline-none"
          />

          {/* Send note action */}
          <button
            type="button"
            aria-label="Send note"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600"
          >
            <MailSendEmailMessage
              primaryColor="var(--color-n-50)"
              className="size-4.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

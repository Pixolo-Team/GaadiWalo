// LIBRARIES //
import Link from "next/link";

// COMPONENTS //
import WhatsappLogo from "@/components/icons/neevo-icons/WhatsappLogo";
import { LeadContactActions } from "@/components/sales/LeadContactActions";
import { Badge } from "@/components/ui/badge";

const statusClassNameData = {
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
} as const;

interface LeadDetailsProfilePropsData {
  age: string;
  avatarLabel: string;
  name: string;
  phoneNumber: string;
  status: string;
  statusTone: keyof typeof statusClassNameData;
}

/**
 * Renders the lead profile summary used at the top of lead detail tabs.
 */
export function LeadDetailsProfile({
  age,
  avatarLabel,
  name,
  phoneNumber,
  status,
  statusTone,
}: Readonly<LeadDetailsProfilePropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const statusClassName = statusClassNameData[statusTone];

  // Use Effects

  return (
    <div className="flex flex-col gap-3.5 bg-n-50 p-5">
      {/* Lead profile row */}
      <div className="flex items-center gap-3.5">
        {/* Lead avatar */}
        <div className="flex size-13 items-center justify-center rounded-full bg-blue-50">
          <span className="text-lg font-semibold text-blue-600">
            {avatarLabel}
          </span>
        </div>

        {/* Lead profile text */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-lg font-bold text-n-800">{name}</p>

          {/* Lead status row */}
          <div className="flex items-center gap-2">
            <Badge
              className={`h-auto rounded-3xl px-3 py-1 font-secondary text-xs tracking-[-0.2px] ${statusClassName}`}
            >
              {status}
            </Badge>
            <span className="font-secondary text-xs text-n-500">{age}</span>
          </div>
        </div>
      </div>

      {/* Lead contact row */}
      <div className="flex items-start justify-between gap-3">
        {/* Phone and copy actions */}
        <LeadContactActions phoneNumber={phoneNumber} />

        {/* WhatsApp action */}
        <Link
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Open WhatsApp chat"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-100 active:bg-green-200"
        >
          <WhatsappLogo
            primaryColor="var(--color-green-600)"
            className="size-4.5"
          />
        </Link>
      </div>
    </div>
  );
}

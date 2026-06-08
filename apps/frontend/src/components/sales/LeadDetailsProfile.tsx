// TYPES //
import type { LeadStatusToneData, LeadTemperatureData } from "@/types/leads";

// LIBRARIES //
import Link from "next/link";

// COMPONENTS //
import WhatsappLogo from "@/components/icons/neevo-icons/WhatsappLogo";
import { LeadContactActions } from "@/components/sales/LeadContactActions";
import { Badge } from "@/components/ui/badge";

// MODULES //
import { TEMPERATURE_ICON, TEMPERATURE_LABEL } from "@/constants/temperature";
import { salesLeadToneClassNameData } from "@/data/sales";

interface LeadDetailsProfilePropsData {
  age: string;
  avatarLabel: string;
  name: string;
  phoneNumber: string;
  status: string;
  statusTone: LeadStatusToneData;
  temperature?: LeadTemperatureData | null;
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
  temperature,
}: LeadDetailsProfilePropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const statusClassName = salesLeadToneClassNameData[statusTone].status;

  // Use Effects

  return (
    <div className="bg-n-50 flex flex-col gap-3.5 p-6">
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
          <p className="text-n-800 text-lg font-bold">{name}</p>

          {/* Lead status row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`font-secondary h-auto rounded-3xl px-3 py-1 text-xs tracking-[-0.2px] ${statusClassName}`}
            >
              {status}
            </Badge>

            {/* Temperature badge */}
            {temperature ? (
              <span className="font-secondary border-n-200 bg-n-100 text-n-700 flex items-center gap-1 rounded-3xl border px-2.5 py-1 text-xs">
                <span>{TEMPERATURE_ICON[temperature]}</span>
                {TEMPERATURE_LABEL[temperature]}
              </span>
            ) : null}

            <span className="font-secondary text-n-500 text-xs">{age}</span>
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

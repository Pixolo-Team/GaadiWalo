// LIBRARIES //
import Image from "next/image";
import Link from "next/link";

// COMPONENTS //
import WhatsappLogo from "@/components/icons/neevo-icons/WhatsappLogo";
import { LeadContactActions } from "@/components/sales/LeadContactActions";
import { Badge } from "@/components/ui/badge";

interface LeadCardPropsData {
  detailsHref?: string;
  name: string;
  onCall?: () => void;
  onCopy?: () => void;
  phoneNumber: string;
  source: string;
  statusLabel: string;
  statusTone: "amber" | "blue" | "green" | "purple" | "red";
  vehicleName: string;
}

/**
 * Renders a lead item card with status and quick contact actions.
 */
export function LeadCard({
  detailsHref,
  name,
  onCall,
  onCopy,
  phoneNumber,
  source,
  statusLabel,
  statusTone,
  vehicleName,
}: Readonly<LeadCardPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const toneClassNameData = {
    amber: {
      border: "border-amber-500",
      dot: "bg-gradient-to-b from-amber-400 to-amber-600",
      status: "bg-amber-100 text-amber-600",
    },
    blue: {
      border: "border-blue-500",
      dot: "bg-gradient-to-b from-blue-400 to-blue-600",
      status: "bg-blue-100 text-blue-600",
    },
    green: {
      border: "border-green-500",
      dot: "bg-gradient-to-b from-green-400 to-green-600",
      status: "bg-green-100 text-green-600",
    },
    purple: {
      border: "border-purple-500",
      dot: "bg-gradient-to-b from-purple-400 to-purple-600",
      status: "bg-purple-100 text-purple-600",
    },
    red: {
      border: "border-red-500",
      dot: "bg-gradient-to-b from-red-400 to-red-600",
      status: "bg-red-100 text-red-600",
    },
  };

  const borderToneClassName = toneClassNameData[statusTone].border;
  const dotToneClassName = toneClassNameData[statusTone].dot;
  const statusClassName = toneClassNameData[statusTone].status;

  // Use Effects

  return (
    <article
      className={`bg-n-50 relative flex flex-col gap-3 rounded-[20px] border-l-4 px-5 py-4 ${borderToneClassName}`}
    >
      {/* Lead details link */}
      {detailsHref ? (
        <Link
          href={detailsHref}
          aria-label={`Open details for ${name}`}
          className="absolute inset-0 z-0 rounded-[20px]"
        />
      ) : null}

      {/* Top row */}
      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
        {/* Lead identity */}
        <div className="flex flex-col gap-1.5">
          <p className="text-n-800 text-base leading-none font-semibold">
            {name}
          </p>

          {/* Vehicle source row */}
          <div className="flex items-center gap-2">
            {/* Vehicle image */}
            <div className="size-9 rounded-full">
              <Image
                src="/images/alto.png"
                alt={vehicleName}
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Vehicle details */}
            <div className="flex flex-col gap-0.5">
              <p className="font-secondary text-n-600 text-xs leading-none font-bold">
                {vehicleName}
              </p>

              {/* Lead source and status dot */}
              <div className="flex items-center gap-1">
                <p className="font-secondary text-n-600 text-xs">{source}</p>
                <span className="border-n-200 bg-n-50 flex size-4 items-center justify-center rounded-full border">
                  <span className={`size-3 rounded-full ${dotToneClassName}`} />
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Status badge */}
        <Badge
          className={`font-secondary h-auto rounded-3xl text-xs tracking-[-0.2px] ${statusClassName}`}
        >
          {statusLabel}
        </Badge>
      </div>

      {/* Contact actions */}
      <div className="relative z-20 flex items-center justify-between gap-3">
        {/* Phone and copy actions */}
        <LeadContactActions
          phoneNumber={phoneNumber}
          onCall={onCall}
          onCopy={onCopy}
        />

        {/* WhatsApp action */}
        <Link
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Open WhatsApp chat"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-100 p-0 active:bg-green-200"
        >
          <WhatsappLogo
            primaryColor="var(--color-green-600)"
            className="size-4.5"
          />
        </Link>
      </div>
    </article>
  );
}

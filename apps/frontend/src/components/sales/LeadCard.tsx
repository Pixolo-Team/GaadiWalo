"use client";

// TYPES //
import type { LeadStatusToneData, LeadTemperatureData } from "@/types/leads";

// COMPONENTS //
import Image from "next/image";
import Link from "next/link";
import Motion from "@/components/animations/Motion";
import WhatsappLogo from "@/components/icons/neevo-icons/WhatsappLogo";
import { LeadContactActions } from "@/components/sales/LeadContactActions";
import { Badge } from "@/components/ui/badge";

// UTILS //
import { cardEnter } from "@/lib/animations";

// MODULES //
import { ROUTES } from "@/constants/routes";
import { TEMPERATURE_ICON, TEMPERATURE_LABEL } from "@/constants/temperature";
import { salesLeadToneClassNameData } from "@/data/sales";

interface LeadCardPropsData {
  href?: string;
  motionDelay?: number;
  name: string;
  onCall?: () => void;
  onCopy?: () => void;
  phoneNumber: string;
  source: string;
  statusLabel: string;
  statusTone: LeadStatusToneData;
  temperature?: LeadTemperatureData | null;
  vehicleName: string;
}

/** Lead Card Component */
export function LeadCard({
  href,
  motionDelay = 0,
  name,
  onCall,
  onCopy,
  phoneNumber,
  source,
  statusLabel,
  statusTone,
  temperature,
  vehicleName,
}: LeadCardPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const borderToneClassName = salesLeadToneClassNameData[statusTone].border;
  const dotToneClassName = salesLeadToneClassNameData[statusTone].dot;
  const statusClassName = salesLeadToneClassNameData[statusTone].status;
  const detailsPageHref = href ?? ROUTES.sales.leads;

  // Use Effects

  return (
    <Motion
      as="div"
      variants={cardEnter}
      delay={motionDelay}
      className={`bg-n-50 relative flex flex-col gap-3 rounded-[20px] border-l-4 px-5 py-4 ${borderToneClassName}`}
    >
      {/* Full-card clickable overlay */}
      <Link
        href={detailsPageHref}
        prefetch={false}
        aria-label={`Open details for ${name}`}
        className="absolute inset-0 z-0 rounded-[20px]"
      />

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
              {/* Vehicle Name */}
              <p className="font-secondary text-n-600 text-xs leading-none font-bold">
                {vehicleName}
              </p>

              {/* Lead source and status dot */}
              <div className="flex items-center gap-1">
                {/* Source  */}
                <p className="font-secondary text-n-600 text-xs">{source}</p>

                {/* Status dot */}
                <span className="border-n-200 bg-n-50 flex size-4 items-center justify-center rounded-full border">
                  <span className={`size-3 rounded-full ${dotToneClassName}`} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status and temperature badges */}
        <div className="flex flex-col items-end gap-1.5">
          <Badge
            className={`font-secondary h-auto rounded-3xl text-xs tracking-[-0.2px] ${statusClassName}`}
          >
            {statusLabel}
          </Badge>

          {/* Temperature badge */}
          {temperature ? (
            <span className="font-secondary border-n-200 bg-n-100 text-n-700 flex items-center gap-1 rounded-3xl border px-2 py-0.5 text-xs">
              <span>{TEMPERATURE_ICON[temperature]}</span>
              {TEMPERATURE_LABEL[temperature]}
            </span>
          ) : null}
        </div>
      </div>

      {/* Contact actions */}
      <div className="relative z-20 flex items-center justify-between gap-3">
        {/* Lead contact actions component to copy or call */}
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
          {/* Icon */}
          <WhatsappLogo
            primaryColor="var(--color-green-600)"
            className="size-4.5"
          />
        </Link>
      </div>
    </Motion>
  );
}

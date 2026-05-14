// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { LeadDetailsInfoCard } from "@/components/sales/LeadDetailsInfoCard";
import { Button } from "@/components/ui/button";

interface LeadInfoTabPropsData {
  carInterestRows: ReadonlyArray<{
    isHighlighted: boolean;
    key: string;
    label: string;
    value: string;
  }>;
  contactInfoRows: ReadonlyArray<{
    isHighlighted: boolean;
    key: string;
    label: string;
    value: string;
  }>;
  leadStatusOptions: ReadonlyArray<{ label: string; value: string }>;
  lostReasonOptions: ReadonlyArray<{ label: string; value: string }>;
  onLeadStatusChange: (value: string) => void;
  onLostReasonChange: (value: string) => void;
  selectedLeadStatus: string;
  selectedLostReason: string;
}

/**
 * Renders the lead info tab with status update and detail cards.
 */
export function LeadInfoTab({
  carInterestRows,
  contactInfoRows,
  leadStatusOptions,
  lostReasonOptions,
  onLeadStatusChange,
  onLostReasonChange,
  selectedLeadStatus,
  selectedLostReason,
}: Readonly<LeadInfoTabPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col gap-3">
      {/* Update status card */}
      <div className="flex flex-col gap-2.5 rounded-[14px] bg-n-50 p-4">
        {/* Card title */}
        <p className="font-secondary text-xs font-medium tracking-[0.5px] text-n-600 uppercase">
          Update Status
        </p>

        {/* Status dropdown */}
        <Dropdown
          options={leadStatusOptions}
          selectedOption={selectedLeadStatus}
          onChange={onLeadStatusChange}
        />

        {/* Lost reason dropdown */}
        <Dropdown
          options={lostReasonOptions}
          selectedOption={selectedLostReason}
          onChange={onLostReasonChange}
        />

        {/* Update status action */}
        <Button type="button">Update Status</Button>
      </div>

      {/* Contact info card */}
      <LeadDetailsInfoCard title="Contact Info" rows={contactInfoRows} />

      {/* Car interest card */}
      <LeadDetailsInfoCard title="Car Interest" rows={carInterestRows} />
    </div>
  );
}

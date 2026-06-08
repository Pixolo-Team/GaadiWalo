// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { LeadDetailsInfoCard } from "@/components/sales/LeadDetailsInfoCard";
import { Button } from "@/components/ui/button";

const TEMPERATURE_OPTIONS = [
  { label: "🔥 Hot", value: "HOT" },
  { label: "☀️ Warm", value: "WARM" },
  { label: "❄️ Cold", value: "COLD" },
];

interface InfoTabPropsData {
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
  isUpdatingStatus: boolean;
  leadStatusOptions: ReadonlyArray<{ label: string; value: string }>;
  lostReasonOptions: ReadonlyArray<{ label: string; value: string }>;
  onLeadStatusChange: (value: string) => void;
  onLostReasonChange: (value: string) => void;
  onTemperatureChange: (value: string) => void;
  onUpdateStatus: () => void;
  selectedLeadStatus: string;
  selectedLostReason: string;
  selectedTemperature: string;
}

/** Lead Info Tab */
export function InfoTab({
  carInterestRows,
  contactInfoRows,
  isUpdatingStatus,
  leadStatusOptions,
  lostReasonOptions,
  onLeadStatusChange,
  onLostReasonChange,
  onTemperatureChange,
  onUpdateStatus,
  selectedLeadStatus,
  selectedLostReason,
  selectedTemperature,
}: InfoTabPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col gap-3">
      {/* Update status card */}
      <div className="bg-n-50 flex flex-col gap-2.5 rounded-[14px] p-4">
        {/* Card title */}
        <p className="font-secondary text-n-600 text-xs font-medium tracking-[0.5px] uppercase">
          Update Status
        </p>

        {/* Status dropdown */}
        <Dropdown
          options={leadStatusOptions}
          selectedOption={selectedLeadStatus}
          onChange={onLeadStatusChange}
          placeholder={leadStatusOptions[0]?.label}
        />

        {/* Lost reason dropdown */}
        {selectedLeadStatus === "LOST" ? (
          <Dropdown
            options={lostReasonOptions}
            selectedOption={selectedLostReason}
            onChange={onLostReasonChange}
            placeholder={lostReasonOptions[0]?.label}
          />
        ) : null}

        {/* Temperature dropdown */}
        <Dropdown
          options={TEMPERATURE_OPTIONS}
          selectedOption={selectedTemperature}
          onChange={onTemperatureChange}
          placeholder="Set Temperature"
        />

        {/* Update status action */}
        <Button
          type="button"
          onClick={onUpdateStatus}
          disabled={isUpdatingStatus}
        >
          Update Status
        </Button>
      </div>

      {/* Contact info card */}
      <LeadDetailsInfoCard title="Contact Info" rows={contactInfoRows} />

      {/* Car interest card */}
      <LeadDetailsInfoCard title="Car Interest" rows={carInterestRows} />
    </div>
  );
}

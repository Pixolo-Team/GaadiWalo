// REACT //
import { useState } from "react";

// COMPONENTS //
import CheckDoubleReadDoneAll from "@/components/icons/neevo-icons/CheckDoubleReadDoneAll";
import Copy1 from "@/components/icons/neevo-icons/Copy1";
import Phone from "@/components/icons/neevo-icons/Phone";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeadContactActionsPropsData {
  onCall?: () => void;
  onCopy?: () => void;
  phoneNumber: string;
}

/** Lead Contact Actions Component */
export function LeadContactActions({
  onCall,
  onCopy,
  phoneNumber,
}: LeadContactActionsPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [isPhoneNumberCopied, setIsPhoneNumberCopied] = useState<boolean>(false);

  // Helper Functions
  /**
   * Copies the lead phone number to clipboard.
   */
  const handleCopyPhoneNumber = async (): Promise<void> => {
    try {
      // Copy lead phone number to user clipboard.
      await navigator.clipboard.writeText(phoneNumber);

      // Show inline copied state on the action button.
      setIsPhoneNumberCopied(true);

      // Reset copied state after a short delay.
      window.setTimeout(() => {
        setIsPhoneNumberCopied(false);
      }, 2000);

      // Run optional callback after successful copy.
      onCopy?.();
    } catch {}
  };

  // Use Effects

  return (
    <div className="border-n-200 bg-n-100 flex items-center gap-3 rounded-[20px] border px-3 py-2">
      {/* Phone action */}
      <Button
        asChild
        variant="secondary"
        className="text-n-600 h-auto w-auto justify-start gap-2 border-0 bg-transparent px-0 py-0 shadow-none hover:bg-transparent active:bg-transparent"
      >
        <Link href={`tel:${phoneNumber}`} onClick={onCall}>
          {/* Phone Icon */}
          <Phone primaryColor="var(--color-n-600)" className="size-5" />

          {/* Phone Number */}
          <span className="font-secondary text-sm leading-none font-bold">
            {phoneNumber}
          </span>
        </Link>
      </Button>

      {/* Divider */}
      <span className="bg-n-200 h-6 w-px" />

      {/* Copy action */}
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          void handleCopyPhoneNumber();
        }}
        className="h-auto w-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent active:bg-transparent"
      >
        {/* Copy status icon */}
        {isPhoneNumberCopied ? (
          <CheckDoubleReadDoneAll
            primaryColor="var(--color-n-600)"
            className="size-5"
          />
        ) : (
          <Copy1 primaryColor="var(--color-n-600)" className="size-5" />
        )}
      </Button>
    </div>
  );
}

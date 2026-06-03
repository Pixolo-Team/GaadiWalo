// COMPONENTS //
import Image from "next/image";

/** Powered by GaadiWalo branding footer — shown on main tab screens. */
export function PoweredByFooter() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col items-center gap-1.5 py-4">
      <p className="font-secondary text-n-400 text-xs">Powered by</p>
      <Image
        src="/images/brand/brand-logo-dark.png"
        alt="GaadiWalo"
        width={120}
        height={40}
        className="h-auto w-full max-w-[100px] object-contain"
      />
    </div>
  );
}

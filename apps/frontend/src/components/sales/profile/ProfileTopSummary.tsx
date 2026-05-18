"use client";

// TYPES //
interface ProfileTopSummaryPropsData {
  avatarLabel: string;
  branch: string;
  joined: string;
  name: string;
  role: string;
  userId: string;
}

/** Renders the profile hero summary with avatar and basic user metadata. */
export default function ProfileTopSummary({
  avatarLabel,
  branch,
  joined,
  name,
  role,
  userId,
}: ProfileTopSummaryPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="bg-linear-to-br from-blue-700 to-[#0d3b9e] px-6 py-7">
      {/* User details row */}
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="flex size-[52px] items-center justify-center rounded-full bg-white/20">
          <p className="font-primary text-n-50 text-xl font-semibold">
            {avatarLabel}
          </p>
        </div>

        {/* Name and metadata */}
        <div className="flex flex-col gap-0.5">
          <p className="font-primary text-n-50 text-[1.125rem] font-bold">
            {name}
          </p>
          <p className="font-secondary text-sm font-medium text-white/75">
            {role} · ID: {userId}
          </p>
          <p className="font-secondary text-xs text-white/50">
            Joined: {joined} · {branch}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { AdminSalespersonData } from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import Add1 from "@/components/icons/neevo-icons/Add1";
import { PoweredByFooter } from "@/components/common/PoweredByFooter";

// API SERVICES //
import { getAdminTeamRequest } from "@/services/api/admin-team.api.service";

// MODULES //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

/** Returns a deterministic avatar background color class based on name initial. */
const getAvatarColorService = (name: string): string => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-green-100 text-green-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  const index = (name.charCodeAt(0) ?? 0) % colors.length;
  return colors[index] ?? colors[0];
};

/** Formats a joinedAt ISO date string to "Jan 2025" format. */
const formatJoinedDateService = (joinedAt: string): string => {
  const date = new Date(joinedAt);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/** Computes average leads per day for the current month. */
const getAvgPerDayService = (leads: number): number => {
  const dayOfMonth = Math.max(new Date().getDate(), 1);
  return Math.round(leads / dayOfMonth);
};

/** Admin Team Management Page */
export default function AdminTeamPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [teamItems, setTeamItems] = useState<AdminSalespersonData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Helper Functions
  /** Fetches team list — fetches both active and inactive when All is selected. */
  const fetchTeamService = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (selectedStatus === "") {
        // All tab — fetch active and inactive in parallel and combine
        const [activeResponse, inactiveResponse] = await Promise.all([
          getAdminTeamRequest({ search: searchValue || undefined, status: "active" }),
          getAdminTeamRequest({ search: searchValue || undefined, status: "inactive" }),
        ]);

        const activeItems = activeResponse.status_code === 200 ? (activeResponse.data ?? []) : [];
        const inactiveItems = inactiveResponse.status_code === 200 ? (inactiveResponse.data ?? []) : [];
        setTeamItems([...activeItems, ...inactiveItems]);
      } else {
        const response = await getAdminTeamRequest({
          search: searchValue || undefined,
          status: selectedStatus as "active" | "inactive",
        });

        if (response.status_code === 200) {
          setTeamItems(response.data ?? []);
        } else {
          toast.error(response.error ?? response.message);
        }
      }
    } catch {
      toast.error("Unable to load team. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchValue, selectedStatus]);

  // Use Effects
  useEffect(() => {
    const timeout = window.setTimeout(() => void fetchTeamService(), 0);
    return () => window.clearTimeout(timeout);
  }, [fetchTeamService]);

  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="shrink-0">
          <Header
            title="Team"
            rightIcon={
              <Add1 primaryColor="var(--color-blue-600)" className="size-5" />
            }
            rightLabel="Add team member"
            onRightIconClick={() => router.push(ROUTES.admin.teamAdd)}
          />
        </div>

        {/* Scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {/* Search */}
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search salesperson..."
            />

            {/* Status filter */}
            <div className="flex gap-2">
              {statusOptions.map((statusItem) => (
                <button
                  key={statusItem.value}
                  type="button"
                  onClick={() => setSelectedStatus(statusItem.value)}
                  className={`font-secondary rounded-3xl border px-4 py-2 text-xs font-semibold ${
                    selectedStatus === statusItem.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-n-200 bg-n-50 text-n-600"
                  }`}
                >
                  {statusItem.label}
                </button>
              ))}
            </div>

            {/* Team list */}
            <div className="flex flex-col gap-3">
              {isLoading
                ? Array.from({ length: 4 }).map((_, indexItem) => (
                    <div
                      key={indexItem}
                      className="bg-n-50 animate-pulse rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-n-200 size-12 shrink-0 rounded-full" />
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="bg-n-200 h-4 w-32 rounded-full" />
                          <div className="bg-n-200 h-3 w-24 rounded-full" />
                          <div className="bg-n-200 h-5 w-20 rounded-full" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="bg-n-200 h-6 w-6 rounded-full" />
                          <div className="bg-n-200 h-3 w-8 rounded-full" />
                        </div>
                      </div>
                      <div className="bg-n-200 mt-4 h-px w-full" />
                      <div className="mt-3 flex justify-between">
                        {Array.from({ length: 3 }).map((__, statIndex) => (
                          <div key={statIndex} className="flex flex-col items-center gap-1">
                            <div className="bg-n-200 h-4 w-8 rounded-full" />
                            <div className="bg-n-200 h-3 w-12 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                : null}

              {!isLoading && teamItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-8 text-center text-sm">
                  No team members found.
                </p>
              ) : null}

              {!isLoading
                ? teamItems.map((memberItem) => (
                    <button
                      key={memberItem.id}
                      type="button"
                      onClick={() =>
                        router.push(ROUTES.admin.teamMember(memberItem.id))
                      }
                      className="bg-n-50 w-full rounded-2xl p-4 text-left shadow-sm"
                    >
                      {/* Top row — avatar, info, won */}
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getAvatarColorService(memberItem.fullName)}`}
                        >
                          {memberItem.fullName
                            .split(" ")
                            .slice(0, 2)
                            .map((wordItem) => wordItem.charAt(0).toUpperCase())
                            .join("")}
                        </div>

                        {/* Name + ID + badge */}
                        <div className="min-w-0 flex-1">
                          <p className="text-n-900 truncate text-base font-bold">
                            {memberItem.fullName}
                          </p>
                          <p className="font-secondary text-n-500 text-xs">
                            ID: {memberItem.userId} · {memberItem.branch?.name ?? "—"}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span
                              className={`font-secondary rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                memberItem.status === "Active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-n-200 text-n-500"
                              }`}
                            >
                              {memberItem.status}
                            </span>
                            {memberItem.joinedAt ? (
                              <span className="font-secondary text-n-400 text-xs">
                                Joined{" "}
                                {formatJoinedDateService(memberItem.joinedAt)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Won */}
                        <div className="flex shrink-0 flex-col items-end">
                          <p className="text-n-900 text-xl font-bold leading-none">
                            {memberItem.thisMonth.won}
                          </p>
                          <p className="font-secondary text-n-400 text-xs">
                            Won
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="bg-n-200 my-3 h-px w-full" />

                      {/* Stats row */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center gap-0.5">
                          <p className="text-n-900 text-base font-bold">
                            {memberItem.thisMonth.leads}
                          </p>
                          <p className="font-secondary text-n-400 text-xs">
                            Leads
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                          <p className="text-base font-bold text-green-500">
                            {memberItem.thisMonth.winRate}%
                          </p>
                          <p className="font-secondary text-n-400 text-xs">
                            Conv. Rate
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-0.5">
                          <p className="text-n-900 text-base font-bold">
                            {getAvgPerDayService(memberItem.thisMonth.leads)}
                          </p>
                          <p className="font-secondary text-n-400 text-xs">
                            Avg/day
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                : null}
            </div>

            <PoweredByFooter />
          </div>
        </div>
      </div>
    </section>
  );
}

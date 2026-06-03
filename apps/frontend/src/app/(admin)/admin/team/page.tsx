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
  /** Fetches team list with current filters. */
  const fetchTeamService = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getAdminTeamRequest({
        search: searchValue || undefined,
        status: (selectedStatus as "active" | "inactive") || undefined,
      });

      if (response.status_code === 200) {
        setTeamItems(response.data ?? []);
      } else {
        toast.error(response.error ?? response.message);
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
              placeholder="Search by name, email, phone..."
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

            {/* Team count */}
            <p className="font-secondary text-n-500 text-xs">
              {isLoading ? "Loading..." : `${teamItems.length} members`}
            </p>

            {/* Team list */}
            <div className="flex flex-col gap-3">
              {isLoading
                ? Array.from({ length: 4 }).map((_, indexItem) => (
                    <div
                      key={indexItem}
                      className="bg-n-200 h-20 animate-pulse rounded-2xl"
                    />
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
                      className="bg-n-50 flex w-full items-center gap-3 rounded-2xl p-4 text-left"
                    >
                      {/* Avatar */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <span className="font-secondary text-sm font-bold text-blue-700">
                          {memberItem.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-n-800 truncate text-sm font-semibold">
                          {memberItem.fullName}
                        </p>
                        <p className="font-secondary text-n-500 truncate text-xs">
                          {memberItem.email}
                        </p>
                        <p className="font-secondary text-n-400 text-xs">
                          {memberItem.branch?.name ?? "—"} ·{" "}
                          {memberItem.role?.name ?? "—"}
                        </p>
                      </div>

                      {/* Status + stats */}
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`font-secondary rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            memberItem.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-n-200 text-n-500"
                          }`}
                        >
                          {memberItem.status}
                        </span>
                        <p className="font-secondary text-n-500 text-[10px]">
                          {memberItem.thisMonth.leads} leads ·{" "}
                          {memberItem.thisMonth.won} won
                        </p>
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

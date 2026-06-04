"use client";

// REACT //
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { AdminReferrerData } from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import { PoweredByFooter } from "@/components/common/PoweredByFooter";

// SERVICES //
import { getAdminReferrersRequest } from "@/services/api/admin-referrers.api.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

const sortOptions = [
  { label: "Most Referrals", value: "most-referrals" },
  { label: "Best Conversion", value: "best-conversion" },
] as const;

/** Admin Referrers Page */
export default function AdminReferrersPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [referrerItems, setReferrerItems] = useState<AdminReferrerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<"most-referrals" | "best-conversion">(
    "most-referrals",
  );
  const [totalItems, setTotalItems] = useState<number>(0);

  // Helper Functions
  const filteredReferrerItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return referrerItems;

    return referrerItems.filter(
      (referrerItem) =>
        referrerItem.name.toLowerCase().includes(normalizedSearch) ||
        referrerItem.phone.includes(normalizedSearch) ||
        (referrerItem.city ?? "").toLowerCase().includes(normalizedSearch),
    );
  }, [referrerItems, searchValue]);

  /** Fetches referrers list. */
  const fetchReferrersService = async (
    sort: "best-conversion" | "most-referrals",
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getAdminReferrersRequest({ sort, limit: 50 });

      if (response.status_code === 200 && response.data) {
        setReferrerItems(response.data.items);
        setTotalItems(response.data.totalItems);
      } else {
        toast.error(response.error ?? response.message);
      }
    } catch {
      toast.error("Unable to load referrers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use Effects
  useEffect(() => {
    void fetchReferrersService(selectedSort);
  }, [selectedSort]);

  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="shrink-0">
          <Header title="Referrers" />
        </div>

        {/* Content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {/* Search */}
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search by name, phone, city..."
            />

            {/* Sort filter */}
            <div className="flex gap-2">
              {sortOptions.map((sortItem) => (
                <button
                  key={sortItem.value}
                  type="button"
                  onClick={() => setSelectedSort(sortItem.value)}
                  className={`font-secondary rounded-3xl border px-4 py-2 text-xs font-semibold ${
                    selectedSort === sortItem.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-n-200 bg-n-50 text-n-600"
                  }`}
                >
                  {sortItem.label}
                </button>
              ))}
            </div>

            {/* Count */}
            <p className="font-secondary text-n-500 text-xs">
              {isLoading
                ? "Loading..."
                : `${filteredReferrerItems.length} of ${totalItems} referrers`}
            </p>

            {/* List */}
            <div className="flex flex-col gap-3">
              {isLoading
                ? Array.from({ length: 5 }).map((_, indexItem) => (
                    <div
                      key={indexItem}
                      className="bg-n-200 h-20 animate-pulse rounded-2xl"
                    />
                  ))
                : null}

              {!isLoading && filteredReferrerItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-8 text-center text-sm">
                  No referrers found.
                </p>
              ) : null}

              {!isLoading
                ? filteredReferrerItems.map((referrerItem) => (
                    <button
                      key={referrerItem.id}
                      type="button"
                      onClick={() =>
                        router.push(ROUTES.admin.referrerDetail(referrerItem.id))
                      }
                      className="bg-n-50 flex w-full items-center gap-3 rounded-2xl p-4 text-left"
                    >
                      {/* Avatar */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <span className="font-secondary text-sm font-bold text-amber-700">
                          {referrerItem.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-n-800 truncate text-sm font-semibold">
                          {referrerItem.name}
                        </p>
                        <p className="font-secondary text-n-500 text-xs">
                          {referrerItem.phone}
                          {referrerItem.city ? ` · ${referrerItem.city}` : ""}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="font-secondary text-n-700 text-xs font-semibold">
                          {referrerItem.totalReferrals} referrals
                        </p>
                        <p className="font-secondary text-xs font-bold text-green-600">
                          {referrerItem.conversionRate}% conv.
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

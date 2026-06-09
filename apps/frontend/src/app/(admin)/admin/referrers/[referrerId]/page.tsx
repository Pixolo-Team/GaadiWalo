"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

// TYPES //
import type {
  AdminReferredLeadData,
  AdminReferrerDetailData,
} from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import MetricItem from "@/components/sales/profile/MetricItem";

// SERVICES //
import {
  getAdminReferredLeadsRequest,
  getAdminReferrerByIdRequest,
} from "@/services/api/admin-referrers.api.service";


// OTHERS //
import { toast } from "sonner";

const leadStatusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  INTERESTED: "bg-amber-100 text-amber-700",
  TEST_DRIVE: "bg-orange-100 text-orange-700",
  NEGOTIATION: "bg-cyan-100 text-cyan-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

/** Admin — Referrer Detail Page */
export default function ReferrerDetailPage() {
  // Define Navigation
  const params = useParams<{ referrerId: string }>();
  const searchParams = useSearchParams();
  const referrerId = params.referrerId;

  // Define Context

  // Define Refs

  // Define States
  const [referrer, setReferrer] = useState<AdminReferrerDetailData | null>(null);
  const [referredLeadItems, setReferredLeadItems] = useState<
    AdminReferredLeadData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLeadsLoading, setIsLeadsLoading] = useState<boolean>(true);
  const [totalLeads, setTotalLeads] = useState<number>(0);

  // Helper Functions
  const fromCategory = searchParams.get("from");
  const categoryLabel =
    fromCategory === "most-referrals"
      ? "🏆 Most Referrals"
      : fromCategory === "best-conversion"
        ? "🎯 Best Conversion"
        : null;

  /** Fetches referrer profile. */
  const fetchReferrerService = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getAdminReferrerByIdRequest(referrerId);
      if (response.status_code === 200 && response.data) {
        setReferrer(response.data);
      } else {
        toast.error("Referrer not found.");
      }
    } catch {
      toast.error("Unable to load referrer.");
    } finally {
      setIsLoading(false);
    }
  }, [referrerId]);

  /** Fetches leads referred by this referrer. */
  const fetchReferredLeadsService = useCallback(async (): Promise<void> => {
    setIsLeadsLoading(true);
    try {
      const response = await getAdminReferredLeadsRequest(referrerId, {
        limit: 50,
      });
      if (response.status_code === 200 && response.data) {
        setReferredLeadItems(response.data.items);
        setTotalLeads(response.data.totalItems);
      }
    } catch {
      toast.error("Unable to load referred leads.");
    } finally {
      setIsLeadsLoading(false);
    }
  }, [referrerId]);

  // Use Effects
  useEffect(() => {
    void fetchReferrerService();
    void fetchReferredLeadsService();
  }, [fetchReferrerService, fetchReferredLeadsService]);

  return (
    <section className="bg-n-100 h-full">
      <div className="flex flex-col">
        <Header title="Referrer Detail" />

        {isLoading ? (
          <div className="flex flex-col gap-5 p-6 animate-pulse">
            {/* Profile card skeleton */}
            <div className="bg-n-50 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="bg-n-200 size-14 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="bg-n-200 h-4 w-36 rounded-lg" />
                  <div className="bg-n-200 h-3 w-24 rounded-lg" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-n-200 h-16 rounded-xl" />
                <div className="bg-n-200 h-16 rounded-xl" />
                <div className="bg-n-200 h-16 rounded-xl" />
              </div>
            </div>
            {/* Contact card skeleton */}
            <div className="bg-n-50 flex flex-col gap-4 rounded-2xl p-5">
              {Array.from({ length: 3 }).map((_, indexItem) => (
                <div key={indexItem} className="flex items-center justify-between">
                  <div className="bg-n-200 h-3 w-16 rounded-lg" />
                  <div className="bg-n-200 h-3 w-28 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ) : !referrer ? null : (
          <div className="flex flex-col gap-5 p-6">
            {/* Profile card */}
            <div className="bg-n-50 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-xl font-bold text-amber-700">
                    {referrer.name.charAt(0).toUpperCase()}
                  </span>
                  {referrer.isTopReferrer ? (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px]">
                      ★
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-n-900 truncate text-base font-bold">
                      {referrer.name}
                    </p>
                    {referrer.isTopReferrer ? (
                      <span className="font-secondary rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Top Referrer
                      </span>
                    ) : null}
                    {categoryLabel ? (
                      <span className="font-secondary rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        {categoryLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-secondary text-n-500 text-xs">
                    {referrer.phone}
                  </p>
                  {referrer.city ? (
                    <p className="font-secondary text-n-400 text-xs">
                      {referrer.city}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MetricItem
                  label="Referrals"
                  value={String(referrer.totalReferrals)}
                  helper=""
                  tone="neutral"
                />
                <MetricItem
                  label="Won"
                  value={String(referrer.won)}
                  helper=""
                  tone="green"
                />
                <MetricItem
                  label="Conv."
                  value={`${referrer.conversionRate}%`}
                  helper=""
                  tone="blue"
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-n-50 flex flex-col gap-3 rounded-2xl p-5">
              <p className="text-n-800 text-sm font-bold">Contact</p>
              <DetailRow label="Phone" value={referrer.phone} />
              {referrer.email ? (
                <DetailRow label="Email" value={referrer.email} />
              ) : null}
              {referrer.city ? (
                <DetailRow label="City" value={referrer.city} />
              ) : null}
              <DetailRow
                label="Member Since"
                value={new Date(referrer.since).toLocaleDateString()}
              />
            </div>

            {/* Referred leads */}
            <div>
              <p className="font-secondary text-n-600 mb-3 text-xs font-semibold uppercase tracking-wide">
                Referred Leads ({totalLeads})
              </p>

              {isLeadsLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, indexItem) => (
                    <div
                      key={indexItem}
                      className="bg-n-200 h-14 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : referredLeadItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-6 text-center text-sm">
                  No leads referred yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {referredLeadItems.map((leadItem) => (
                    <div
                      key={leadItem.id}
                      className="bg-n-50 flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-n-800 truncate text-sm font-semibold">
                          {leadItem.leadName}
                        </p>
                        <p className="font-secondary text-n-500 text-xs">
                          {leadItem.month}
                        </p>
                      </div>
                      <span
                        className={`font-secondary rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          leadStatusColors[leadItem.status] ??
                          "bg-n-200 text-n-600"
                        }`}
                      >
                        {leadItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Local sub-component ────────────────────────────────────────────────────

interface DetailRowPropsData {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowPropsData) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="font-secondary text-n-500 shrink-0 text-xs">{label}</p>
      <p className="text-n-800 min-w-0 break-all text-right text-sm font-medium">{value}</p>
    </div>
  );
}

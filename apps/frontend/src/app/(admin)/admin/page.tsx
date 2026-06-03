"use client";

// REACT //
import { useEffect, useState } from "react";

// TYPES //
import type {
  AdminLeadsBySourceData,
  AdminSummaryData,
  AdminTopPerformerData,
  AdminTopReferrerData,
} from "@/types/admin";

// COMPONENTS //
import Image from "next/image";
import { PoweredByFooter } from "@/components/common/PoweredByFooter";

// API SERVICES //
import {
  getAdminLeadsBySourceRequest,
  getAdminSummaryRequest,
  getAdminTopPerformersRequest,
  getAdminTopReferrersRequest,
} from "@/services/api/admin-dashboard.api.service";

// MODULES //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/** Returns the previous month as YYYY-MM string. */
const getLastMonthValueService = (): string => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonth.getFullYear();
  const month = String(lastMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const periodOptions = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: getLastMonthValueService() },
];

/** Admin Dashboard Page */
export default function AdminDashboardPage() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<AdminSummaryData | null>(null);
  const [sourceItems, setSourceItems] = useState<AdminLeadsBySourceData[]>([]);
  const [performerItems, setPerformerItems] = useState<
    AdminTopPerformerData[]
  >([]);
  const [referrerItems, setReferrerItems] = useState<AdminTopReferrerData[]>(
    [],
  );

  // Helper Functions
  const totalSourceCount = sourceItems.reduce(
    (sumItem, sourceItem) => sumItem + sourceItem.count,
    0,
  );

  /** Loads all dashboard data in parallel. */
  const fetchDashboardService = async (period: string): Promise<void> => {
    setIsLoading(true);
    try {
      const [summaryResponse, sourcesResponse, performersResponse, referrersResponse] =
        await Promise.all([
          getAdminSummaryRequest(period),
          getAdminLeadsBySourceRequest(period),
          getAdminTopPerformersRequest(period, 5),
          getAdminTopReferrersRequest(period, 5),
        ]);

      if (summaryResponse.status_code === 200) setSummary(summaryResponse.data ?? null);
      if (sourcesResponse.status_code === 200) setSourceItems(sourcesResponse.data ?? []);
      if (performersResponse.status_code === 200) setPerformerItems(performersResponse.data ?? []);
      if (referrersResponse.status_code === 200) setReferrerItems(referrersResponse.data ?? []);
    } catch {
      toast.error("Unable to load dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Use Effects
  useEffect(() => {
    void fetchDashboardService(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <section className="bg-n-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-6 pb-6 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-white">Admin Dashboard</p>
            <p className="font-secondary mt-0.5 text-sm text-blue-200">
              Welcome, {user?.name ?? "Admin"}
            </p>
          </div>
          <Image
            src="/images/brand/brand-logo.png"
            alt="GaadiWalo"
            width={90}
            height={30}
            className="h-auto w-auto max-w-[80px] object-contain"
          />
        </div>

        {/* Period selector */}
        <div className="mt-4 flex gap-2">
          {periodOptions.map((periodItem) => (
            <button
              key={periodItem.value}
              type="button"
              onClick={() => setSelectedPeriod(periodItem.value)}
              className={`font-secondary rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedPeriod === periodItem.value
                  ? "bg-white text-blue-700"
                  : "bg-blue-800/50 text-blue-100"
              }`}
            >
              {periodItem.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6">
        {/* Summary Metrics */}
        <div>
          <p className="font-secondary text-n-600 mb-3 text-xs font-semibold uppercase tracking-wide">
            Overview
          </p>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, indexItem) => (
                <div
                  key={indexItem}
                  className="bg-n-200 h-20 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Total Leads"
                value={summary?.totalLeads ?? 0}
                change={summary?.totalLeadsChange}
                accent="blue"
              />
              <SummaryCard
                label="Active Leads"
                value={summary?.activeLeads ?? 0}
                accent="amber"
              />
              <SummaryCard
                label="Won"
                value={summary?.won ?? 0}
                change={summary?.wonChange}
                accent="green"
              />
              <SummaryCard
                label="Conversion"
                value={`${summary?.conversionRate ?? 0}%`}
                accent="purple"
              />
            </div>
          )}
        </div>

        {/* Leads by Source */}
        <div className="bg-n-50 rounded-2xl p-4">
          <p className="font-secondary text-n-700 mb-3 text-sm font-semibold">
            Leads by Source
          </p>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, indexItem) => (
                <div key={indexItem} className="bg-n-200 h-8 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : sourceItems.length === 0 ? (
            <p className="font-secondary text-n-500 py-3 text-center text-sm">
              No source data available.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {sourceItems.map((sourceItem) => {
                const widthPercent =
                  totalSourceCount > 0
                    ? Math.round((sourceItem.count / totalSourceCount) * 100)
                    : 0;
                return (
                  <div key={sourceItem.source}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-secondary text-n-700 text-xs font-medium">
                        {sourceItem.source}
                      </span>
                      <span className="font-secondary text-n-600 text-xs">
                        {sourceItem.count} ({widthPercent}%)
                      </span>
                    </div>
                    <div className="bg-n-200 h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: sourceItem.color || "#3b82f6",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div>
          <p className="font-secondary text-n-600 mb-3 text-xs font-semibold uppercase tracking-wide">
            Top Performers
          </p>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, indexItem) => (
                <div key={indexItem} className="bg-n-200 h-14 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : performerItems.length === 0 ? (
            <p className="font-secondary text-n-500 py-3 text-center text-sm">
              No performer data yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {performerItems.map((performerItem) => (
                <div
                  key={performerItem.userId}
                  className="bg-n-50 flex items-center gap-3 rounded-2xl p-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <span className="font-secondary text-xs font-bold text-blue-700">
                      #{performerItem.rank}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-n-800 truncate text-sm font-semibold">
                      {performerItem.name}
                    </p>
                    <p className="font-secondary text-n-500 text-xs">
                      {performerItem.leads} leads · {performerItem.won} won
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-secondary text-xs font-bold text-green-600">
                      {performerItem.winRate}%
                    </p>
                    <p className="font-secondary text-n-400 text-[10px]">
                      win rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div>
          <p className="font-secondary text-n-600 mb-3 text-xs font-semibold uppercase tracking-wide">
            Top Referrers
          </p>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, indexItem) => (
                <div key={indexItem} className="bg-n-200 h-14 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : referrerItems.length === 0 ? (
            <p className="font-secondary text-n-500 py-3 text-center text-sm">
              No referrer data yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {referrerItems.map((referrerItem) => (
                <div
                  key={referrerItem.id}
                  className="bg-n-50 flex items-center gap-3 rounded-2xl p-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="font-secondary text-xs font-bold text-amber-700">
                      {referrerItem.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-n-800 truncate text-sm font-semibold">
                      {referrerItem.name}
                    </p>
                    <p className="font-secondary text-n-500 text-xs">
                      {referrerItem.referrals} referrals · {referrerItem.converted} won
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-secondary text-xs font-bold text-amber-600">
                      {referrerItem.conversionRate}%
                    </p>
                    <p className="font-secondary text-n-400 text-[10px]">
                      conversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <PoweredByFooter />
      </div>
    </section>
  );
}

// ─── Local sub-component ────────────────────────────────────────────────────

interface SummaryCardPropsData {
  accent: "amber" | "blue" | "green" | "purple";
  change?: number;
  label: string;
  value: number | string;
}

const accentStyles: Record<
  SummaryCardPropsData["accent"],
  { bg: string; text: string; badge: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-600",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    badge: "bg-green-100 text-green-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-600",
  },
};

function SummaryCard({ accent, change, label, value }: SummaryCardPropsData) {
  const styles = accentStyles[accent];
  const hasChange = change !== undefined && change !== null;
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className={`${styles.bg} flex flex-col gap-1 rounded-2xl p-4`}>
      <p className="font-secondary text-n-600 text-xs">{label}</p>
      <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
      {hasChange ? (
        <span
          className={`font-secondary w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isPositive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change} vs last month
        </span>
      ) : null}
    </div>
  );
}

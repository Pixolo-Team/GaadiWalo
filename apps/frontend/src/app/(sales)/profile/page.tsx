"use client";

// LIBRARIES //
import Link from "next/link";

// COMPONENTS //
import CustomDownArrow from "@/components/icons/neevo-icons/CustomDownArrow";
import DesktopMonitorBrowseActivityPerformance from "@/components/icons/neevo-icons/DesktopMonitorBrowseActivityPerformance";
import LoginPassword from "@/components/icons/neevo-icons/LoginPassword";
import Logout3 from "@/components/icons/neevo-icons/Logout3";
import UserEditPencil from "@/components/icons/neevo-icons/UserEditPencil";
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import { ROUTES } from "@/constants/routes";

// DATA //
import {
  salesProfileMenuItems,
  salesProfileMetrics,
  salesProfileSummaryData,
} from "@/data/sales";

/**
 * Renders the sales profile screen.
 */
export default function ProfilePage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const getMetricValueColorClassName = (tone: string): string => {
    if (tone === "blue") {
      return "text-blue-600";
    }

    if (tone === "green") {
      return "text-green-600";
    }

    return "text-n-800";
  };

  const getMenuIcon = (icon: string) => {
    if (icon === "edit-profile") {
      return <UserEditPencil primaryColor="var(--color-blue-600)" className="size-5" />;
    }

    if (icon === "change-password") {
      return <LoginPassword primaryColor="var(--color-amber-600)" className="size-5" />;
    }

    if (icon === "notifications") {
      return <BellNotification primaryColor="var(--color-purple-600)" className="size-5" />;
    }

    if (icon === "performance") {
      return (
        <DesktopMonitorBrowseActivityPerformance
          primaryColor="var(--color-green-600)"
          className="size-5"
        />
      );
    }

    return <Logout3 primaryColor="var(--color-red-600)" className="size-5" />;
  };

  const getMenuIconBackgroundClassName = (tone: string): string => {
    if (tone === "blue") {
      return "bg-blue-100";
    }

    if (tone === "amber") {
      return "bg-amber-100";
    }

    if (tone === "purple") {
      return "bg-purple-100";
    }

    if (tone === "green") {
      return "bg-green-100";
    }

    return "bg-red-100";
  };

  // Use Effects

  return (
    <section className="h-full bg-n-50">
      {/* Profile page shell */}
      <div className="flex h-full flex-col">
        {/* Profile top summary */}
        <div className="bg-linear-to-br from-blue-700 to-[#0d3b9e] px-6 py-7">
          {/* User details row */}
          <div className="flex items-start gap-3.5">
            {/* Avatar */}
            <div className="flex size-[52px] items-center justify-center rounded-full bg-white/20">
              <p className="font-primary text-n-50 text-xl font-semibold">
                {salesProfileSummaryData.avatarLabel}
              </p>
            </div>

            {/* Name and metadata */}
            <div className="flex flex-col gap-0.5">
              <p className="font-primary text-n-50 text-[1.125rem] font-bold">
                {salesProfileSummaryData.name}
              </p>
              <p className="font-secondary text-sm font-medium text-white/75">
                {salesProfileSummaryData.role} · ID: {salesProfileSummaryData.userId}
              </p>
              <p className="font-secondary text-xs text-white/50">
                Joined: {salesProfileSummaryData.joined} · {salesProfileSummaryData.branch}
              </p>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="bg-n-100 min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Content stack */}
          <div className="flex flex-col gap-6">
            {/* Metrics cards */}
            <div className="flex gap-2">
              {salesProfileMetrics.map((metricItem) => (
                <div
                  key={metricItem.key}
                  className="border-n-200 bg-n-50 flex flex-1 flex-col items-center gap-1 rounded-[14px] border px-4 py-3.5"
                >
                  <p className="font-secondary text-n-500 text-xs font-medium tracking-wide uppercase">
                    {metricItem.label}
                  </p>
                  <p
                    className={`font-primary text-3xl font-bold leading-none ${getMetricValueColorClassName(metricItem.tone)}`}
                  >
                    {metricItem.value}
                  </p>
                  <p className="font-secondary text-n-600 text-xs">{metricItem.helper}</p>
                </div>
              ))}
            </div>

            {/* Profile menu list */}
            <div className="flex flex-col gap-3">
              {salesProfileMenuItems.map((menuItem) => {
                const isEditProfileItem = menuItem.key === "edit-profile";

                if (isEditProfileItem) {
                  return (
                    <Link
                      key={menuItem.key}
                      href={ROUTES.sales.profileEdit}
                      className="bg-n-50 flex items-center gap-3.5 rounded-xl px-5 py-[15px]"
                    >
                      {/* Menu icon */}
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${getMenuIconBackgroundClassName(menuItem.tone)}`}
                      >
                        {getMenuIcon(menuItem.icon)}
                      </span>

                      {/* Menu label */}
                      <span className="font-secondary text-n-800 flex-1 text-[0.9375rem]">
                        {menuItem.label}
                      </span>

                      {/* Menu chevron */}
                      <span className="flex size-5 items-center justify-center">
                        <CustomDownArrow
                          primaryColor="var(--color-n-400)"
                          className="size-4 -rotate-90"
                        />
                      </span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={menuItem.key}
                    type="button"
                    className="bg-n-50 flex w-full items-center gap-3.5 rounded-xl px-5 py-[15px] text-left"
                  >
                    {/* Menu icon */}
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${getMenuIconBackgroundClassName(menuItem.tone)}`}
                    >
                      {getMenuIcon(menuItem.icon)}
                    </span>

                    {/* Menu label */}
                    <span className="font-secondary text-n-800 flex-1 text-[0.9375rem]">
                      {menuItem.label}
                    </span>

                    {/* Menu chevron */}
                    <span className="flex size-5 items-center justify-center">
                      <CustomDownArrow
                        primaryColor="var(--color-n-400)"
                        className="size-4 -rotate-90"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

// COMPONENTS //
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import DesktopMonitorBrowseActivityPerformance from "@/components/icons/neevo-icons/DesktopMonitorBrowseActivityPerformance";
import LoginPassword from "@/components/icons/neevo-icons/LoginPassword";
import Logout3 from "@/components/icons/neevo-icons/Logout3";
import UserEditPencil from "@/components/icons/neevo-icons/UserEditPencil";
import MetricItem from "@/components/sales/profile/MetricItem";
import ProfileMenuItem from "@/components/sales/profile/ProfileMenuItem";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// DATA //
import { salesProfileMetrics, salesProfileSummaryData } from "@/data/sales";

/** Profile Page Component */
export default function ProfilePage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <section className="bg-n-50 h-full">
      {/* Profile page shell */}
      <div className="flex h-full flex-col">
        {/* Profile top summary */}
        <ProfileTopSummary
          avatarLabel={salesProfileSummaryData.avatarLabel}
          branch={salesProfileSummaryData.branch}
          joined={salesProfileSummaryData.joined}
          name={salesProfileSummaryData.name}
          role={salesProfileSummaryData.role}
          userId={salesProfileSummaryData.userId}
        />

        {/* Profile content */}
        <div className="bg-n-100 min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Content stack */}
          <div className="flex flex-col gap-6">
            {/* Metrics cards */}
            <div className="flex gap-2">
              {salesProfileMetrics.map((metricItem) => (
                <MetricItem
                  key={metricItem.key}
                  helper={metricItem.helper}
                  label={metricItem.label}
                  tone={metricItem.tone}
                  value={metricItem.value}
                />
              ))}
            </div>

            {/* Profile menu list */}
            <div className="flex flex-col gap-3">
              {/* Edit profile navigation item */}
              <ProfileMenuItem
                href={ROUTES.sales.profileEdit}
                iconBackgroundColor="bg-blue-100"
                iconNode={
                  <UserEditPencil
                    primaryColor="var(--color-blue-600)"
                    className="size-5"
                  />
                }
                label="Edit Profile"
              />
              {/* Change password action item */}
              <ProfileMenuItem
                iconBackgroundColor="bg-amber-100"
                iconNode={
                  <LoginPassword
                    primaryColor="var(--color-amber-600)"
                    className="size-5"
                  />
                }
                label="Change Password"
              />
              {/* Notification preferences action item */}
              <ProfileMenuItem
                iconBackgroundColor="bg-purple-100"
                iconNode={
                  <BellNotification
                    primaryColor="var(--color-purple-600)"
                    className="size-5"
                  />
                }
                label="Notification Preferences"
              />
              {/* Performance report action item */}
              <ProfileMenuItem
                iconBackgroundColor="bg-green-100"
                iconNode={
                  <DesktopMonitorBrowseActivityPerformance
                    primaryColor="var(--color-green-600)"
                    className="size-5"
                  />
                }
                label="My Performance Report"
              />

              {/* Logout action item */}
              <ProfileMenuItem
                iconBackgroundColor="bg-red-100"
                iconNode={
                  <Logout3
                    primaryColor="var(--color-red-600)"
                    className="size-5"
                  />
                }
                label="Logout"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

// REACT //
import { useEffect, useState } from "react";

// COMPONENTS //
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import DesktopMonitorBrowseActivityPerformance from "@/components/icons/neevo-icons/DesktopMonitorBrowseActivityPerformance";
import LoginPassword from "@/components/icons/neevo-icons/LoginPassword";
import Logout3 from "@/components/icons/neevo-icons/Logout3";
import UserEditPencil from "@/components/icons/neevo-icons/UserEditPencil";
import MetricItem from "@/components/sales/profile/MetricItem";
import ProfileMenuItem from "@/components/sales/profile/ProfileMenuItem";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";

// SERVICES //
import { getSalesProfileRequest } from "@/services/api/sales-profile.api.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// DATA //
import { salesProfileMetrics, salesProfileSummaryData } from "@/data/sales";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { SalesProfileData } from "@/types/profile";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/** Profile Page Component */
export default function ProfilePage() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [salesProfile, setSalesProfile] = useState<SalesProfileData | null>(
    null,
  );
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  // Helper Functions
  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  /**
   * Fetches sales profile for logged-in user.
   */
  const getSalesProfile = (): void => {
    if (!userCode) {
      setIsProfileLoading(false);
      return;
    }

    /**
     * Call get sales profile API.
     */
    getSalesProfileRequest(userCode)
      .then((response: ApiResponseData<SalesProfileData>) => {
        if (response.status_code === 200 && response.data) {
          // Set sales profile state
          setSalesProfile(response.data);
        } else {
          // Reset sales profile state
          setSalesProfile(null);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load profile right now.");

        // Reset sales profile state
        setSalesProfile(null);
      })
      .finally(() => {
        // Set profile loading false
        setIsProfileLoading(false);
      });
  };

  // Use Effects
  useEffect(() => {
    getSalesProfile();
  }, [userCode]);

  const summaryProfile = {
    avatarLabel:
      salesProfile?.fullName
        ?.split(" ")
        .slice(0, 2)
        .map((wordItem) => wordItem.charAt(0).toUpperCase())
        .join("") ?? salesProfileSummaryData.avatarLabel,
    branch: salesProfile?.branch ?? salesProfileSummaryData.branch,
    joined:
      (salesProfile?.joinedAt
        ? new Date(salesProfile.joinedAt).toLocaleDateString()
        : "") || salesProfileSummaryData.joined,
    name: salesProfile?.fullName ?? salesProfileSummaryData.name,
    role: salesProfile?.role ?? salesProfileSummaryData.role,
    userId: salesProfile?.userId ?? salesProfileSummaryData.userId,
  };

  if (isProfileLoading) {
    return (
      <section className="bg-n-50 h-full">
        <div className="flex h-full items-center justify-center">
          <p className="font-secondary text-n-600 text-sm">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-n-50 h-full">
      {/* Profile page shell */}
      <div className="flex h-full flex-col">
        {/* Profile top summary */}
        <ProfileTopSummary
          avatarLabel={summaryProfile.avatarLabel}
          branch={summaryProfile.branch}
          joined={summaryProfile.joined}
          name={summaryProfile.name}
          role={summaryProfile.role}
          userId={summaryProfile.userId}
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
                  className="items-center"
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
                href={ROUTES.sales.profileChangePassword}
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
                href={ROUTES.sales.profileNotifications}
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
                href={ROUTES.sales.profilePerformance}
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

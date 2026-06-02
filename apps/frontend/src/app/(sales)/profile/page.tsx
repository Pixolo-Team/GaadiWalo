"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import DesktopMonitorBrowseActivityPerformance from "@/components/icons/neevo-icons/DesktopMonitorBrowseActivityPerformance";
import LoginPassword from "@/components/icons/neevo-icons/LoginPassword";
import Logout3 from "@/components/icons/neevo-icons/Logout3";
import UserEditPencil from "@/components/icons/neevo-icons/UserEditPencil";
import Motion from "@/components/animations/Motion";
import MetricItem from "@/components/sales/profile/MetricItem";
import ProfileMenuItem from "@/components/sales/profile/ProfileMenuItem";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";

// SERVICES //
import { logoutRequest } from "@/services/api/auth.api.service";
import { getSalesProfileRequest } from "@/services/api/sales-profile.api.service";

// UTILS //
import { cardEnter, staggerContainer } from "@/lib/animations";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// DATA //
import { salesProfileMetrics, salesProfileSummaryData } from "@/data/sales";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { LogoutResponseData } from "@/types/auth";
import type { SalesProfileData } from "@/types/profile";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/** Profile Page Component */
export default function ProfilePage() {
  // Define Navigation
  const router = useRouter();

  // Define Context
  const { clearAuthSessionService, session, user } = useAuthContext();

  // Define Refs

  // Define States
  const [salesProfile, setSalesProfile] = useState<SalesProfileData | null>(
    null,
  );
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isLogoutSubmitting, setIsLogoutSubmitting] = useState<boolean>(false);

  // Helper Functions
  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";
  const accessToken = session?.token ?? "";

  /**
   * Fetches sales profile for logged-in user.
   */
  const getSalesProfile = useCallback((): void => {
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
  }, [userCode]);

  /**
   * Logs out the authenticated user from backend and local session state.
   */
  const handleLogout = useCallback((): void => {
    if (isLogoutSubmitting) {
      return;
    }

    if (!accessToken) {
      // Error toast when logout cannot be authenticated from frontend state.
      toast.error("Unable to logout right now. Please try again.");
      return;
    }

    // Set logout submitting state.
    setIsLogoutSubmitting(true);

    /**
     * Call logout API.
     */
    logoutRequest(accessToken)
      .then((response: ApiResponseData<LogoutResponseData>) => {
        if (response.status_code === 200 && response.data?.success) {
          // Clear local session only after confirmed backend logout.
          clearAuthSessionService();

          // Success toast.
          toast.success(response.message);

          // Route user back to login page.
          router.replace(ROUTES.auth.login);
          return;
        }

        // Error toast.
        toast.error(response.error ?? response.message);
      })
      .catch(() => {
        // Error toast.
        toast.error("Unable to logout right now. Please try again.");
      })
      .finally(() => {
        // Reset logout submitting state.
        setIsLogoutSubmitting(false);
      });
  }, [accessToken, clearAuthSessionService, isLogoutSubmitting, router]);

  // Use Effects
  useEffect(() => {
    const profileLoadTimeout = window.setTimeout(() => {
      getSalesProfile();
    }, 0);

    return () => {
      window.clearTimeout(profileLoadTimeout);
    };
  }, [getSalesProfile]);

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
        <div className="bg-n-100 scrollbar-hide min-h-0 flex-1 overflow-y-auto px-6 py-6">
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

            {/* Profile menu list — items enter one by one */}
            <Motion
              as="div"
              variants={staggerContainer}
              className="flex flex-col gap-3"
            >
              {/* Edit profile navigation item */}
              <Motion as="div" variants={cardEnter}>
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
              </Motion>

              {/* Change password action item */}
              <Motion as="div" variants={cardEnter}>
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
              </Motion>

              {/* Performance report action item */}
              <Motion as="div" variants={cardEnter}>
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
              </Motion>

              {/* Logout action item */}
              <Motion as="div" variants={cardEnter}>
                <ProfileMenuItem
                  iconBackgroundColor="bg-red-100"
                  iconNode={
                    <Logout3
                      primaryColor="var(--color-red-600)"
                      className="size-5"
                    />
                  }
                  label="Logout"
                  onClick={handleLogout}
                />
              </Motion>
            </Motion>
          </div>
        </div>
      </div>
    </section>
  );
}

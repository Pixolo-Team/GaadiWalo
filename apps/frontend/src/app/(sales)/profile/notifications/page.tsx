"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import { Switch } from "@/components/ui/switch";

// DATA //
import {
  salesNotificationPreferenceGroups,
  salesNotificationQuietHoursTimeOptions,
} from "@/data/sales";

interface NotificationStateData {
  [key: string]: boolean;
}

/** Notifications Page Component */
export default function ProfileNotificationsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [notificationState, setNotificationState] =
    useState<NotificationStateData>({
      "new-lead-assigned": true,
      "overdue-follow-ups": true,
      "push-notification": true,
      sms: false,
      "status-change-alerts": true,
      "test-drive-reminders": true,
      "won-lost-summary": false,
      whatsapp: false,
      "quiet-hours": true,
    });
  const [quietHoursFrom, setQuietHoursFrom] = useState<string>("10-pm");
  const [quietHoursTo, setQuietHoursTo] = useState<string>("8-am");

  // Helper Functions
  const handleToggle = (key: string): void => {
    setNotificationState((previousState) => ({
      ...previousState,
      [key]: !previousState[key],
    }));
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Notifications page shell */}
      <div className="flex h-full flex-col">
        {/* Notifications header */}
        <Header title="Notifications" />

        {/* Notifications scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Content stack */}
          <div className="flex flex-col gap-6">
            {/* Info card */}
            <div className="flex items-start gap-4 rounded-[14px] bg-blue-100 px-[18px] py-4">
              <BellNotification
                primaryColor="var(--color-blue-600)"
                className="size-5 shrink-0"
              />
              <p className="font-secondary text-sm font-medium text-blue-800">
                Notifications help you never miss a follow-up or status change.
              </p>
            </div>

            {/* Preference groups */}
            {salesNotificationPreferenceGroups.map((groupItem) => (
              <div key={groupItem.key} className="flex flex-col gap-1.5">
                {/* Group title */}
                <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                  {groupItem.title}
                </p>

                {/* Group card */}
                <div className="bg-n-50 rounded-[14px] px-5 py-5">
                  {/* Group items */}
                  <div className="flex flex-col gap-3">
                    {groupItem.items.map((item, index) => {
                      const isEnabled = Boolean(notificationState[item.key]);
                      const isLastItem = index === groupItem.items.length - 1;

                      return (
                        <div key={item.key} className="flex flex-col gap-3">
                          {/* Preference row */}
                          <div className="flex items-center gap-6">
                            {/* Preference text */}
                            <div className="flex flex-1 flex-col gap-0.5">
                              <p className="font-secondary text-n-700 text-sm font-medium">
                                {item.title}
                              </p>
                              {item.description ? (
                                <p className="font-secondary text-n-500 text-xs">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>

                            {/* Preference toggle */}
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={() => handleToggle(item.key)}
                            />
                          </div>

                          {/* Row divider */}
                          {isLastItem ? null : (
                            <div className="bg-n-200 h-px w-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Quiet hours section */}
            <div className="flex flex-col gap-1.5">
              {/* Section title */}
              <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                LEAD UPDATES
              </p>

              {/* Section card */}
              <div className="bg-n-50 rounded-[14px] px-5 py-5">
                {/* Quiet hours top row */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-6">
                    {/* Quiet hours text */}
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="font-secondary text-n-700 text-sm font-medium">
                        Enable quiet hours
                      </p>
                      <p className="font-secondary text-n-500 text-xs">
                        No notifications during set hours
                      </p>
                    </div>

                    {/* Quiet hours toggle */}
                    <Switch
                      checked={Boolean(notificationState["quiet-hours"])}
                      onCheckedChange={() => handleToggle("quiet-hours")}
                    />
                  </div>

                  {/* Divider */}
                  <div className="bg-n-200 h-px w-full" />

                  {/* Quiet hours selects */}
                  <div className="flex gap-2.5">
                    <Dropdown
                      label="FROM"
                      options={salesNotificationQuietHoursTimeOptions}
                      selectedOption={quietHoursFrom}
                      onChange={setQuietHoursFrom}
                      title="10:00 PM"
                      className="text-sm"
                    />
                    <Dropdown
                      label="TO"
                      options={salesNotificationQuietHoursTimeOptions}
                      selectedOption={quietHoursTo}
                      onChange={setQuietHoursTo}
                      title="8:00 AM"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

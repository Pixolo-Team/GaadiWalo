"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { LeadActivityTimeline } from "@/components/sales/LeadActivityTimeline";
import { LeadDetailsProfile } from "@/components/sales/LeadDetailsProfile";
import { LeadDetailsTabs } from "@/components/sales/LeadDetailsTabs";
import { LeadInfoTab } from "@/components/sales/LeadInfoTab";
import { LeadNotesPanel } from "@/components/sales/LeadNotesPanel";

// DATA //
import {
  salesLeadActivities,
  salesLeadDetailTabs,
  salesLeadDetails,
  salesLeadLostReasonOptions,
  salesLeadNotes,
  salesLeadStatusOptions,
} from "@/data/sales";

/**
 * Renders the sales lead details screen.
 */
export default function LeadDetailsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedTab, setSelectedTab] = useState<string>(salesLeadDetailTabs[0]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>(
    salesLeadStatusOptions[0].value,
  );
  const [selectedLostReason, setSelectedLostReason] = useState<string>(
    salesLeadLostReasonOptions[0].value,
  );

  // Helper Functions
  const leadDetailsData = salesLeadDetails.lead;
  const isInfoTabSelected = selectedTab === "Info";
  const isActivityTabSelected = selectedTab === "Activity";
  const isNotesTabSelected = selectedTab === "Notes";

  // Use Effects

  return (
    <section className="h-full bg-n-100">
      {/* Lead details page shell */}
      <div className="flex h-full flex-col">
        {/* Lead details header */}
        <Header
          title="Lead Details"
          rightIcon={
            <HorizontalSlider2
              primaryColor="var(--color-n-700)"
              className="size-5"
            />
          }
        />

        {/* Lead details scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Lead profile */}
          <LeadDetailsProfile
            age={leadDetailsData.age}
            avatarLabel={leadDetailsData.avatarLabel}
            name={leadDetailsData.name}
            phoneNumber={leadDetailsData.phoneNumber}
            status={leadDetailsData.status}
            statusTone={leadDetailsData.statusTone}
          />

          {/* Lead details content */}
          <div className="flex flex-col gap-3 px-6 py-3">
            {/* Lead detail tabs */}
            <LeadDetailsTabs
              tabs={salesLeadDetailTabs}
              selectedTab={selectedTab}
              onChange={setSelectedTab}
            />

            {/* Info tab */}
            {isInfoTabSelected ? (
              <LeadInfoTab
                contactInfoRows={salesLeadDetails.contactInfo}
                carInterestRows={salesLeadDetails.carInterest}
                leadStatusOptions={salesLeadStatusOptions}
                lostReasonOptions={salesLeadLostReasonOptions}
                selectedLeadStatus={selectedLeadStatus}
                selectedLostReason={selectedLostReason}
                onLeadStatusChange={setSelectedLeadStatus}
                onLostReasonChange={setSelectedLostReason}
              />
            ) : null}

            {/* Activity tab */}
            {isActivityTabSelected ? (
              <LeadActivityTimeline activities={salesLeadActivities} />
            ) : null}

            {/* Notes tab */}
            {isNotesTabSelected ? <LeadNotesPanel notes={salesLeadNotes} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

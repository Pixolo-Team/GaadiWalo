"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { LeadDetailsProfile } from "@/components/sales/LeadDetailsProfile";
import { LeadDetailsTabs } from "@/components/sales/LeadDetailsTabs";
import { ActivityTab } from "@/components/sales/leads/ActivityTab";
import { InfoTab } from "@/components/sales/leads/InfoTab";
import { NotesTab } from "@/components/sales/leads/NotesTab";

// DATA //
import {
  salesLeadActivities,
  salesLeadDetailTabs,
  salesLeadDetails,
  salesLeadLostReasonOptions,
  salesLeadNotes,
  salesLeadStatusOptions,
} from "@/data/sales";

/** Lead Details Page Component */
export default function LeadDetailsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedTab, setSelectedTab] = useState<string>(
    salesLeadDetailTabs[0],
  );
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
    <section className="bg-n-100">
      {/* Lead details page shell */}
      <div className="flex flex-col">
        {/* Lead details header */}
        <Header title="Lead Details" />

        {/* Lead details scroll content */}
        <div className="flex-1 overflow-y-auto">
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
              <InfoTab
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
              <ActivityTab activities={salesLeadActivities} />
            ) : null}

            {/* Notes tab */}
            {isNotesTabSelected ? <NotesTab notes={salesLeadNotes} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

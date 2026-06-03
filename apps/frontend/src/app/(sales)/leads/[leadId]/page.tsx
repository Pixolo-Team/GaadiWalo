"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  LeadActivityData,
  LeadDetailsData,
  LeadNoteData,
  LeadRequestStateData,
  LeadStatusFormStateData,
  LeadStatusData,
  SalesLeadDetailsTabData,
  LeadStatusOptionData,
} from "@/types/leads";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import MailSendEmailMessage from "@/components/icons/neevo-icons/MailSendEmailMessage";
import { LeadDetailsProfile } from "@/components/sales/LeadDetailsProfile";
import { LeadDetailsTabs } from "@/components/sales/LeadDetailsTabs";
import { ActivityTab } from "@/components/sales/leads/ActivityTab";
import { InfoTab } from "@/components/sales/leads/InfoTab";
import { NotesTab } from "@/components/sales/leads/NotesTab";

// LIBRARIES //
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

// UTILS //
import { tabSlideVariants } from "@/lib/animations";

// DATA //
import { salesLeadDetailTabs } from "@/data/sales";

// SERVICES //
import {
  createLeadNoteRequest,
  getLeadActivitiesRequest,
  getLeadDetailsRequest,
  getLeadNotesRequest,
  getLeadStatusesRequest,
  updateLeadStatusRequest,
} from "@/services/api/sales-leads.api.service";
import {
  getLeadActivityViews,
  getLeadCarInterestRows,
  getLeadContactInfoRows,
  getLeadNoteViews,
  getLeadProfileView,
  getLeadStatusOptions,
  getLostReasonOptions,
} from "@/services/leads.service";

/** Lead Details Page */
export default function LeadDetailsPage() {
  // Define Navigation
  const params = useParams<{ leadId: string }>();

  // Define Context

  // Define Refs

  // Define States
  const [selectedTab, setSelectedTab] = useState<SalesLeadDetailsTabData>(
    salesLeadDetailTabs[0],
  );
  const [tabSlideDirection, setTabSlideDirection] = useState<number>(0);
  const [leadDetails, setLeadDetails] = useState<LeadDetailsData | null>(null);
  const [leadActivities, setLeadActivities] = useState<LeadActivityData[]>([]);
  const [leadNotes, setLeadNotes] = useState<LeadNoteData[]>([]);
  const [leadStatusFormState, setLeadStatusFormState] =
    useState<LeadStatusFormStateData>({
      selectedLeadStatus: "NEW",
      selectedLostReason: "",
    });
  const [leadStatusItems, setLeadStatusItems] = useState<
    LeadStatusOptionData[]
  >([]);
  const [noteInputValue, setNoteInputValue] = useState<string>("");
  const [leadRequestState, setLeadRequestState] =
    useState<LeadRequestStateData>({
      isLeadLoading: true,
      isSendingNote: false,
      isUpdatingStatus: false,
    });

  // Helper Functions
  const leadId = String(params.leadId ?? "");
  const isInfoTabSelected = selectedTab === salesLeadDetailTabs[0];
  const isActivityTabSelected = selectedTab === salesLeadDetailTabs[1];
  const isNotesTabSelected = selectedTab === salesLeadDetailTabs[2];

  /**
   * Handles lead detail tab switch and tracks slide direction for the panel.
   */
  const handleLeadDetailsTabChange = (
    tabValue: SalesLeadDetailsTabData,
  ): void => {
    const currentTabIndex = salesLeadDetailTabs.indexOf(selectedTab);
    const nextTabIndex = salesLeadDetailTabs.indexOf(tabValue);

    setTabSlideDirection(nextTabIndex > currentTabIndex ? 1 : -1);
    setSelectedTab(tabValue);
  };

  /**
   * Handles lead status value change.
   */
  const handleLeadStatusChange = (value: string): void => {
    setLeadStatusFormState({
      selectedLeadStatus: value as LeadStatusData,
      selectedLostReason: "",
    });
  };

  /**
   * Handles lost reason value change.
   */
  const handleLostReasonChange = (value: string): void => {
    setLeadStatusFormState((previousStateItem) => ({
      ...previousStateItem,
      selectedLostReason: value,
    }));
  };

  /**
   * Fetches lead detail payload.
   */
  const fetchLeadDetailsService = useCallback((): void => {
    /**
     * Call get lead details API.
     */
    getLeadDetailsRequest(leadId)
      .then((response: ApiResponseData<LeadDetailsData>) => {
        if (response.status_code === 200 && response.data) {
          // Set Lead Details
          setLeadDetails(response.data);

          // Set Lead Status
          setLeadStatusFormState({
            selectedLeadStatus: response.data.status,
            selectedLostReason: response.data.lostReason ?? "",
          });
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load lead details. Please refresh and try again.");
      })
      .finally(() => {
        setLeadRequestState((previousRequestStateItem) => ({
          ...previousRequestStateItem,
          isLeadLoading: false,
        }));
      });
  }, [leadId]);

  /**
   * Fetches lead activities payload.
   */
  const fetchLeadActivitiesService = useCallback((): void => {
    /**
     * Call get lead activities API.
     */
    getLeadActivitiesRequest(leadId)
      .then((response: ApiResponseData<LeadActivityData[]>) => {
        if (response.status_code === 200) {
          // Set lead activities state
          setLeadActivities(response.data ?? []);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load lead activity right now.");
      });
  }, [leadId]);

  /**
   * Fetches lead notes payload.
   */
  const fetchLeadNotesService = useCallback((): void => {
    /**
     * Call get lead notes API.
     */
    getLeadNotesRequest(leadId)
      .then((response: ApiResponseData<LeadNoteData[]>) => {
        if (response.status_code === 200) {
          // Set lead notes state
          setLeadNotes(response.data ?? []);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load lead notes right now.");
      });
  }, [leadId]);

  /**
   * Fetches lead statuses and reason mappings.
   */
  const fetchLeadStatusesService = useCallback((): void => {
    /**
     * Call get lead statuses API.
     */
    getLeadStatusesRequest()
      .then((response: ApiResponseData<LeadStatusOptionData[]>) => {
        if (response.status_code === 200) {
          // Set lead status options state
          setLeadStatusItems(response.data ?? []);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load lead status options right now.");
      });
  }, []);

  /**
   * Handles lead status update action.
   */
  const handleUpdateLeadStatus = (): void => {
    if (!leadDetails) {
      return;
    }

    if (
      leadStatusFormState.selectedLeadStatus === "LOST" &&
      !leadStatusFormState.selectedLostReason.trim()
    ) {
      toast.error("Please select a lost reason.");
      return;
    }

    setLeadRequestState((previousRequestStateItem) => ({
      ...previousRequestStateItem,
      isUpdatingStatus: true,
    }));

    /**
     * Call update lead status API.
     */
    updateLeadStatusRequest(leadDetails.id, {
      lostReason:
        leadStatusFormState.selectedLeadStatus === "LOST"
          ? leadStatusFormState.selectedLostReason
          : null,
      status: leadStatusFormState.selectedLeadStatus,
    })
      .then((response: ApiResponseData<LeadDetailsData>) => {
        if (response.status_code === 200 && response.data) {
          // Set updated lead details state
          setLeadDetails(response.data);

          // Set updated lead status state
          setLeadStatusFormState({
            selectedLeadStatus: response.data.status,
            selectedLostReason: response.data.lostReason ?? "",
          });

          // Success toast
          toast.success(response.message);

          // Refresh activities after status update
          fetchLeadActivitiesService();
        } else {
          // Error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to update lead status. Please try again.");
      })
      .finally(() => {
        setLeadRequestState((previousRequestStateItem) => ({
          ...previousRequestStateItem,
          isUpdatingStatus: false,
        }));
      });
  };

  /**
   * Handles lead note create action.
   */
  const handleSendLeadNote = (): void => {
    if (!noteInputValue.trim()) {
      return;
    }

    setLeadRequestState((previousRequestStateItem) => ({
      ...previousRequestStateItem,
      isSendingNote: true,
    }));

    /**
     * Call create lead note API.
     */
    createLeadNoteRequest(leadId, {
      content: noteInputValue,
    })
      .then((response: ApiResponseData<LeadNoteData>) => {
        if (response.status_code === 201) {
          // Clear note input
          setNoteInputValue("");

          // Success toast
          toast.success(response.message);

          // Refresh notes and activities after adding note
          fetchLeadNotesService();
          fetchLeadActivitiesService();
        } else {
          // Error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to send note. Please try again.");
      })
      .finally(() => {
        setLeadRequestState((previousRequestStateItem) => ({
          ...previousRequestStateItem,
          isSendingNote: false,
        }));
      });
  };

  // Use Effects
  useEffect(() => {
    if (!leadId) {
      return;
    }

    fetchLeadDetailsService();
    fetchLeadActivitiesService();
    fetchLeadNotesService();
    fetchLeadStatusesService();
  }, [
    leadId,
    fetchLeadActivitiesService,
    fetchLeadDetailsService,
    fetchLeadNotesService,
    fetchLeadStatusesService,
  ]);

  const leadStatusOptions = getLeadStatusOptions(leadStatusItems);
  const lostReasonOptions = getLostReasonOptions(
    leadStatusItems,
    leadStatusFormState.selectedLeadStatus,
  );
  const leadProfileView = getLeadProfileView(leadDetails);
  const contactInfoRows = getLeadContactInfoRows(leadDetails);
  const carInterestRows = getLeadCarInterestRows(leadDetails);
  const activities = getLeadActivityViews(leadActivities);
  const notes = getLeadNoteViews(leadNotes);

  if (leadRequestState.isLeadLoading || !leadProfileView) {
    return (
      <section className="bg-n-100 h-full">
        <div className="flex h-full flex-col">
          {/* Header skeleton */}
          <div className="border-n-200 bg-n-50 flex shrink-0 items-center gap-3.5 border-b px-5 py-4">
            <div className="bg-n-200 size-9 animate-pulse rounded-full" />
            <div className="bg-n-200 h-4 w-28 animate-pulse rounded-full" />
          </div>

          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            {/* Profile card skeleton */}
            <div className="bg-n-50 px-6 py-5">
              <div className="flex animate-pulse items-center gap-4">
                <div className="bg-n-200 size-14 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="bg-n-200 h-4 w-32 rounded-full" />
                  <div className="bg-n-200 h-5 w-16 rounded-full" />
                </div>
              </div>
              {/* Phone + icons row */}
              <div className="mt-4 flex animate-pulse items-center gap-3">
                <div className="bg-n-200 h-4 w-28 rounded-full" />
                <div className="bg-n-200 size-8 rounded-full" />
                <div className="bg-n-200 size-8 rounded-full" />
                <div className="bg-n-200 ml-auto size-8 rounded-full" />
              </div>
            </div>

            {/* Tab bar skeleton */}
            <div className="bg-n-50 border-n-200 flex gap-2 border-b px-6 py-3">
              {Array.from({ length: 3 }).map((_, indexItem) => (
                <div
                  key={indexItem}
                  className="bg-n-200 h-8 w-20 animate-pulse rounded-full"
                />
              ))}
            </div>

            {/* Content sections skeleton */}
            <div className="flex flex-col gap-3 px-6 py-4">
              {Array.from({ length: 4 }).map((_, indexItem) => (
                <div
                  key={indexItem}
                  className="bg-n-200 h-14 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-n-100 h-full">
      {/* Lead details page shell */}
      <div className="flex h-full flex-col">
        {/* Lead details header — sticky, does not scroll */}
        <div className="shrink-0">
          <Header title="Lead Details" />
        </div>

        {/* Lead details scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {/* Lead profile */}
          <LeadDetailsProfile
            age={leadProfileView.age}
            avatarLabel={leadProfileView.avatarLabel}
            name={leadProfileView.name}
            phoneNumber={leadProfileView.phoneNumber}
            status={leadProfileView.status}
            statusTone={leadProfileView.statusTone}
          />

          {/* Lead details content */}
          <div className="flex flex-col gap-3 px-6 py-3">
            {/* Lead detail tabs */}
            <LeadDetailsTabs
              tabs={salesLeadDetailTabs}
              selectedTab={selectedTab}
              onChange={handleLeadDetailsTabChange}
            />

            {/* Sliding tab panel */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={tabSlideDirection}>
                <motion.div
                  key={selectedTab}
                  custom={tabSlideDirection}
                  variants={tabSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {/* Info tab */}
                  {isInfoTabSelected ? (
                    <InfoTab
                      contactInfoRows={contactInfoRows}
                      carInterestRows={carInterestRows}
                      leadStatusOptions={leadStatusOptions}
                      lostReasonOptions={lostReasonOptions}
                      selectedLeadStatus={leadStatusFormState.selectedLeadStatus}
                      selectedLostReason={leadStatusFormState.selectedLostReason}
                      onLeadStatusChange={handleLeadStatusChange}
                      onLostReasonChange={handleLostReasonChange}
                      onUpdateStatus={handleUpdateLeadStatus}
                      isUpdatingStatus={leadRequestState.isUpdatingStatus}
                    />
                  ) : null}

                  {/* Activity tab */}
                  {isActivityTabSelected ? (
                    <ActivityTab activities={activities} />
                  ) : null}

                  {/* Notes tab */}
                  {isNotesTabSelected ? (
                    <NotesTab notes={notes} />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Note input bar — visible only on Notes tab, never scrolls */}
        {isNotesTabSelected ? (
          <div className="border-n-200 bg-n-50 shrink-0 border-t px-3.5 pt-4 pb-5">
            <div className="border-n-200 bg-n-50 flex min-h-14 items-center gap-2 rounded-[32px] border py-2 pr-2 pl-4">
              {/* Note input */}
              <input
                type="text"
                aria-label="Add a note about this lead"
                placeholder="Add a note about this lead..."
                value={noteInputValue}
                onChange={(event) => setNoteInputValue(event.target.value)}
                className="font-secondary text-n-800 placeholder:text-n-400 min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
              />

              {/* Send note action */}
              <button
                type="button"
                onClick={handleSendLeadNote}
                disabled={leadRequestState.isSendingNote}
                aria-label="Send note"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 disabled:opacity-50"
              >
                <MailSendEmailMessage
                  primaryColor="var(--color-n-50)"
                  className="size-4.5"
                />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import { LeadDetailsProfile } from "@/components/sales/LeadDetailsProfile";
import { LeadDetailsTabs } from "@/components/sales/LeadDetailsTabs";
import { ActivityTab } from "@/components/sales/leads/ActivityTab";
import { InfoTab } from "@/components/sales/leads/InfoTab";
import { NotesTab } from "@/components/sales/leads/NotesTab";

// SERVICES //
import {
  createLeadNoteRequest,
  getLeadActivitiesRequest,
  getLeadDetailsRequest,
  getLeadNotesRequest,
  updateLeadStatusRequest,
} from "@/services/api/sales-leads.api.service";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  LeadActivityData,
  LeadDetailsData,
  LeadNoteData,
  LeadStatusData,
} from "@/types/leads";

// OTHERS //
import { toast } from "sonner";

const salesLeadDetailTabs = ["Info", "Activity", "Notes"] as const;
const salesLeadStatusOptions = [
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Test Drive", value: "TEST_DRIVE" },
  { label: "Negotiation", value: "NEGOTIATION" },
  { label: "Won", value: "WON" },
  { label: "Lost", value: "LOST" },
  { label: "Vehicle NA", value: "VEHICLE_NA" },
] as const;
const salesLeadLostReasonOptions = [
  { label: "Price Issue", value: "Price Issue" },
  { label: "No Response", value: "No Response" },
  { label: "Bought Elsewhere", value: "Bought Elsewhere" },
  { label: "Budget Mismatch", value: "Budget Mismatch" },
] as const;

/**
 * Renders the sales lead details flow with API-backed data.
 */
export default function LeadDetailsPage() {
  // Define Navigation
  const params = useParams<{ leadId: string }>();

  // Define Context

  // Define Refs

  // Define States
  const [selectedTab, setSelectedTab] = useState<string>(
    salesLeadDetailTabs[0],
  );
  const [leadDetails, setLeadDetails] = useState<LeadDetailsData | null>(null);
  const [leadActivities, setLeadActivities] = useState<LeadActivityData[]>([]);
  const [leadNotes, setLeadNotes] = useState<LeadNoteData[]>([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>("NEW");
  const [selectedLostReason, setSelectedLostReason] = useState<string>("");
  const [noteInputValue, setNoteInputValue] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isSendingNote, setIsSendingNote] = useState<boolean>(false);
  const [isLeadLoading, setIsLeadLoading] = useState<boolean>(true);

  // Helper Functions
  const leadId = String(params.leadId ?? "");
  const isInfoTabSelected = selectedTab === "Info";
  const isActivityTabSelected = selectedTab === "Activity";
  const isNotesTabSelected = selectedTab === "Notes";

  /**
   * Formats API datetime value into short UI text.
   */
  const getFormattedDateValueService = (dateValue: string | null): string => {
    if (!dateValue) {
      return "";
    }

    const dateObject = new Date(dateValue);
    return dateObject.toLocaleString();
  };

  /**
   * Resolves display tone class key from lead status.
   */
  const getLeadStatusToneService = (
    statusValue: LeadStatusData,
  ): "amber" | "blue" | "green" | "purple" | "red" => {
    if (statusValue === "NEW") {
      return "blue";
    }

    if (statusValue === "CONTACTED") {
      return "amber";
    }

    if (statusValue === "WON") {
      return "green";
    }

    if (statusValue === "LOST" || statusValue === "VEHICLE_NA") {
      return "red";
    }

    return "purple";
  };

  /**
   * Maps API lead status to user-facing label.
   */
  const getLeadStatusLabelService = (statusValue: LeadStatusData): string => {
    return statusValue.replace("_", " ");
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
          setLeadDetails(response.data);
          setSelectedLeadStatus(response.data.status);
          setSelectedLostReason(response.data.lostReason ?? "");
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLeadLoading(false);
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
          setLeadActivities(response.data ?? []);
        }
      })
      .catch(() => {});
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
          setLeadNotes(response.data ?? []);
        }
      })
      .catch(() => {});
  }, [leadId]);

  /**
   * Handles lead status update action.
   */
  const handleUpdateLeadStatus = (): void => {
    if (!leadDetails) {
      return;
    }

    if (selectedLeadStatus === "LOST" && !selectedLostReason.trim()) {
      toast.error("Please select a lost reason.");
      return;
    }

    setIsUpdatingStatus(true);

    /**
     * Call update lead status API.
     */
    updateLeadStatusRequest(leadDetails.id, {
      lostReason: selectedLeadStatus === "LOST" ? selectedLostReason : null,
      status: selectedLeadStatus as LeadStatusData,
    })
      .then((response: ApiResponseData<LeadDetailsData>) => {
        if (response.status_code === 200 && response.data) {
          setLeadDetails(response.data);
          setSelectedLeadStatus(response.data.status);
          setSelectedLostReason(response.data.lostReason ?? "");
          toast.success(response.message);
          fetchLeadActivitiesService();
        } else {
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to update lead status. Please try again.");
      })
      .finally(() => {
        setIsUpdatingStatus(false);
      });
  };

  /**
   * Handles lead note create action.
   */
  const handleSendLeadNote = (): void => {
    if (!noteInputValue.trim()) {
      return;
    }

    setIsSendingNote(true);

    /**
     * Call create lead note API.
     */
    createLeadNoteRequest(leadId, {
      content: noteInputValue,
    })
      .then((response: ApiResponseData<LeadNoteData>) => {
        if (response.status_code === 201) {
          setNoteInputValue("");
          toast.success(response.message);
          fetchLeadNotesService();
          fetchLeadActivitiesService();
        } else {
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to send note. Please try again.");
      })
      .finally(() => {
        setIsSendingNote(false);
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
  }, [
    leadId,
    fetchLeadActivitiesService,
    fetchLeadDetailsService,
    fetchLeadNotesService,
  ]);

  const leadProfileView = leadDetails
    ? {
        age: "",
        avatarLabel: leadDetails.fullName
          .split(" ")
          .slice(0, 2)
          .map((wordItem) => wordItem.charAt(0).toUpperCase())
          .join(""),
        name: leadDetails.fullName,
        phoneNumber: leadDetails.phone,
        status: getLeadStatusLabelService(leadDetails.status),
        statusTone: getLeadStatusToneService(leadDetails.status),
      }
    : null;

  const contactInfoRows = leadDetails
    ? [
        {
          isHighlighted: true,
          key: "phone",
          label: "Phone",
          value: leadDetails.phone,
        },
        {
          isHighlighted: false,
          key: "email",
          label: "Email",
          value: leadDetails.email ?? "-",
        },
        {
          isHighlighted: false,
          key: "source",
          label: "Source",
          value: leadDetails.source,
        },
        {
          isHighlighted: false,
          key: "updated-at",
          label: "Updated",
          value: getFormattedDateValueService(leadDetails.updatedAt) || "-",
        },
      ]
    : [];

  const carInterestRows = leadDetails
    ? [
        {
          isHighlighted: true,
          key: "car-brand",
          label: "Car Brand",
          value: leadDetails.carBrand ?? "-",
        },
        {
          isHighlighted: false,
          key: "car-model",
          label: "Car Model",
          value: leadDetails.carModel ?? "-",
        },
        {
          isHighlighted: false,
          key: "variant-name",
          label: "Variant",
          value: leadDetails.variantName ?? "-",
        },
        {
          isHighlighted: false,
          key: "budget",
          label: "Budget",
          value: leadDetails.budget ?? "-",
        },
      ]
    : [];

  const activities = leadActivities.map((activityItem) => {
    const tone: "amber" | "blue" | "green" | "neutral" | "purple" =
      activityItem.type === "status_change"
        ? "purple"
        : activityItem.type === "note"
          ? "blue"
          : activityItem.type === "system"
            ? "green"
            : activityItem.type === "call"
              ? "amber"
              : "neutral";

    const type: "calendar" | "call" | "lead" | "status" | "whatsapp" =
      activityItem.type === "status_change"
        ? "status"
        : activityItem.type === "note"
          ? "calendar"
          : activityItem.type === "system"
            ? "lead"
            : activityItem.type === "call"
              ? "call"
              : "whatsapp";

    return {
      description: activityItem.description,
      key: activityItem.id,
      meta: getFormattedDateValueService(activityItem.createdAt),
      tone,
      type,
    };
  });

  const notes = leadNotes.map((noteItem) => ({
    author: noteItem.author?.name ?? "Unknown",
    key: noteItem.id,
    message: noteItem.content,
    meta: getFormattedDateValueService(noteItem.createdAt),
    variant: "outgoing" as const,
  }));

  if (isLeadLoading || !leadProfileView) {
    return (
      <section className="bg-n-100">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-secondary text-n-600 text-sm">Loading lead...</p>
        </div>
      </section>
    );
  }

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
              onChange={setSelectedTab}
            />

            {/* Info tab */}
            {isInfoTabSelected ? (
              <InfoTab
                contactInfoRows={contactInfoRows}
                carInterestRows={carInterestRows}
                leadStatusOptions={salesLeadStatusOptions}
                lostReasonOptions={salesLeadLostReasonOptions}
                selectedLeadStatus={selectedLeadStatus}
                selectedLostReason={selectedLostReason}
                onLeadStatusChange={setSelectedLeadStatus}
                onLostReasonChange={setSelectedLostReason}
                onUpdateStatus={handleUpdateLeadStatus}
                isUpdatingStatus={isUpdatingStatus}
              />
            ) : null}

            {/* Activity tab */}
            {isActivityTabSelected ? (
              <ActivityTab activities={activities} />
            ) : null}

            {/* Notes tab */}
            {isNotesTabSelected ? (
              <NotesTab
                notes={notes}
                noteInputValue={noteInputValue}
                onNoteInputChange={setNoteInputValue}
                onSendNote={handleSendLeadNote}
                isSending={isSendingNote}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

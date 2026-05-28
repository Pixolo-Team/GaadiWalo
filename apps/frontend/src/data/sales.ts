// TYPES //
import type { LeadStatusToneData } from "@/types/leads";

/**
 * Sales lead tone class map.
 */
export const salesLeadToneClassNameData: Record<
  LeadStatusToneData,
  { border: string; dot: string; status: string }
> = {
  amber: {
    border: "border-amber-500",
    dot: "bg-gradient-to-b from-amber-400 to-amber-600",
    status: "bg-amber-100 text-amber-600",
  },
  blue: {
    border: "border-blue-500",
    dot: "bg-gradient-to-b from-blue-400 to-blue-600",
    status: "bg-blue-100 text-blue-600",
  },
  green: {
    border: "border-green-500",
    dot: "bg-gradient-to-b from-green-400 to-green-600",
    status: "bg-green-100 text-green-600",
  },
  orange: {
    border: "border-orange-500",
    dot: "bg-gradient-to-b from-orange-400 to-orange-600",
    status: "bg-orange-100 text-orange-600",
  },
  purple: {
    border: "border-purple-500",
    dot: "bg-gradient-to-b from-purple-400 to-purple-600",
    status: "bg-purple-100 text-purple-600",
  },
  red: {
    border: "border-red-500",
    dot: "bg-gradient-to-b from-red-400 to-red-600",
    status: "bg-red-100 text-red-600",
  },
  cyan: {
    border: "border-cyan-500",
    dot: "bg-gradient-to-b from-cyan-400 to-cyan-600",
    status: "bg-cyan-100 text-cyan-600",
  },
  pink: {
    border: "border-pink-500",
    dot: "bg-gradient-to-b from-pink-400 to-pink-600",
    status: "bg-pink-100 text-pink-600",
  },
};

/**
 * Sales lead details tab labels.
 */
export const salesLeadDetailTabs = ["Info", "Activity", "Notes"] as const;

/**
 * Add lead budget options for create-lead API payload values.
 */
export const salesLeadBudgetOptions = [
  { label: "Under 5 Lakh", value: "Under 5 Lakh" },
  { label: "5 - 8 Lakh", value: "5 - 8 Lakh" },
  { label: "8 - 12 Lakh", value: "8 - 12 Lakh" },
  { label: "12+ Lakh", value: "12+ Lakh" },
] as const;

/**
 * Import lead source tag options.
 */
export const salesImportLeadSourceTagOptions = [
  { label: "Skip / Mixed sources", value: "skip-mixed-sources" },
  { label: "CarWale", value: "CarWale" },
  { label: "CarDekho", value: "CarDekho" },
  { label: "Walk In", value: "Walk In" },
  { label: "Referral", value: "Referral" },
] as const;

/**
 * Import duplicate handling options.
 */
export const salesImportDuplicateModeOptions = [
  { label: "Skip existing leads", value: "skip" },
  { label: "Update existing leads", value: "upsert" },
] as const;

/**
 * Import expected columns.
 */
export const salesImportExpectedColumns = [
  "Name",
  "Phone",
  "Email",
  "Source",
  "Car Brand",
  "Car Model",
] as const;

/**
 * Sales profile summary fallback data.
 */
export const salesProfileSummaryData = {
  avatarLabel: "RS",
  branch: "Mumbai Branch",
  email: "rahul.sharma@autolead.in",
  joined: "Jan 2025",
  languagePreference: "english",
  name: "Rahul Sharma",
  phoneNumber: "+91 98765 43210",
  role: "Sales Executive",
  userId: "SP001",
} as const;

/**
 * Sales profile metric cards fallback data.
 */
export const salesProfileMetrics = [
  {
    helper: "Conversion",
    key: "rate",
    label: "RATE",
    tone: "blue",
    value: "19%",
  },
  { helper: "Converted", key: "won", label: "WON", tone: "green", value: "9" },
  {
    helper: "This month",
    key: "leads",
    label: "LEADS",
    tone: "neutral",
    value: "47",
  },
] as const;

/**
 * Sales profile edit language options.
 */
export const salesProfileLanguageOptions = [
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Marathi", value: "marathi" },
] as const;

/**
 * Sales notification preference groups.
 */
export const salesNotificationPreferenceGroups = [
  {
    items: [
      {
        description: "When a lead hasn't been contacted in 3+ days",
        enabled: true,
        key: "overdue-follow-ups",
        title: "Overdue follow-ups",
      },
      {
        description: "1 hour before a scheduled test drive",
        enabled: true,
        key: "test-drive-reminders",
        title: "Test drive reminders",
      },
      {
        description: "When admin assigns a lead to you",
        enabled: true,
        key: "new-lead-assigned",
        title: "New lead assigned",
      },
    ],
    key: "follow-up-reminders",
    title: "FOLLOW-UP REMINDERS",
  },
  {
    items: [
      {
        description: "When a lead moves to a new phase",
        enabled: true,
        key: "status-change-alerts",
        title: "Status change alerts",
      },
      {
        description: "End-of-day win/loss notification",
        enabled: false,
        key: "won-lost-summary",
        title: "Won / Lost summary",
      },
    ],
    key: "lead-updates",
    title: "LEAD UPDATES",
  },
  {
    items: [
      {
        description: "",
        enabled: true,
        key: "push-notification",
        title: "Push notification",
      },
      {
        description: "",
        enabled: false,
        key: "sms",
        title: "SMS",
      },
      {
        description: "",
        enabled: false,
        key: "whatsapp",
        title: "WhatsApp",
      },
    ],
    key: "how-to-notify",
    title: "HOW TO NOTIFY",
  },
] as const;

/**
 * Sales notification quiet hours time options.
 */
export const salesNotificationQuietHoursTimeOptions = [
  { label: "10:00 PM", value: "10-pm" },
  { label: "11:00 PM", value: "11-pm" },
  { label: "12:00 AM", value: "12-am" },
  { label: "8:00 AM", value: "8-am" },
  { label: "9:00 AM", value: "9-am" },
] as const;

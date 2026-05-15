/**
 * Supported lead status tone options.
 */
export type SalesLeadStatusToneData =
  | "amber"
  | "blue"
  | "green"
  | "purple"
  | "red";

/**
 * Sales lead tone class map.
 */
export const salesLeadToneClassNameData: Record<
  SalesLeadStatusToneData,
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
};

// TODO: Remove after API Integration
//Sales filter tag dummy data
export const salesLeadFilterTags = [
  { count: 12, key: "all", label: "All" },
  { count: 4, key: "new", label: "New" },
  { count: 3, key: "contacted", label: "Contacted" },
  { count: 2, key: "interested", label: "Interested" },
] as const;

/**
 * Sales phase card dummy data.
 */
export const salesPhaseCardsDetails = [
  { count: 12, key: "all", label: "All" },
  { count: 4, key: "new", label: "New" },
  { count: 3, key: "contacted", label: "Contacted" },
  { count: 2, key: "interested", label: "Interested" },
  { count: 1, key: "won", label: "🎉 Won" },
] as const;

/**
 * Sales sort option dummy data.
 */
export const salesSortOptions = ["Newest", "Oldest"] as const;

/**
 * Sales location option dummy data.
 */
export const salesLocationOptions = ["Thane", "Mumbai", "Pune"] as const;

/**
 * Sales lead list dummy data.
 */
export const salesLeads = [
  {
    key: "vikram-contacted",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    source: "CarWale",
    statusLabel: "Contacted",
    statusTone: "amber",
    vehicleName: "Maruti Suzuki Swift",
  },
  {
    key: "vikram-new",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    source: "CarWale",
    statusLabel: "New",
    statusTone: "blue",
    vehicleName: "Maruti Suzuki Swift",
  },
  {
    key: "vikram-interested",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    source: "CarWale",
    statusLabel: "Interested",
    statusTone: "purple",
    vehicleName: "Maruti Suzuki Swift",
  },
  {
    key: "vikram-lost",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    source: "CarWale",
    statusLabel: "Lost",
    statusTone: "red",
    vehicleName: "Maruti Suzuki Swift",
  },
] as const;

/**
 * Sales recent leads dummy data.
 */
export const salesRecentLeads = [
  salesLeads[0],
  {
    key: "vikram-won",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    source: "CarWale",
    statusLabel: "🎉 Won",
    statusTone: "green",
    vehicleName: "Maruti Suzuki Swift",
  },
] as const;

/**
 * Sales top header user dummy data.
 */
export const salesHeaderUser = {
  avatarLabel: "RS",
  greeting: "Good Morning 👋",
  name: "Rahul Sharma",
} as const;

/**
 * Sales summary metric dummy data.
 */
export const salesSummaryMetrics = [
  { key: "calls-due", label: "Calls Due", value: "08" },
  { key: "new-leads", label: "New Leads", value: "03" },
  { key: "won-today", label: "Won Today", value: "01" },
] as const;

/**
 * Sales status filter option dummy data.
 */
export const salesStatusFilterOptions = [
  "All",
  "New",
  "Contacted",
  "Interested",
  "Test Drive",
  "Vehicle NA",
  "Won",
  "Lost",
] as const;

/**
 * Sales source filter option dummy data.
 */
export const salesSourceFilterOptions = [
  "All",
  "CarWale",
  "CarDekho",
  "Walk In",
  "Referral",
] as const;

/**
 * Sales branch option dummy data.
 */
export const salesBranchOptions = [
  { label: "All Showrooms", value: "all-showrooms" },
  { label: "Thane", value: "thane" },
  { label: "Mumbai", value: "mumbai" },
] as const;

/**
 * Sales car brand option dummy data.
 */
export const salesCarBrandOptions = [
  { label: "All Brands", value: "all-brands" },
  { label: "Maruti Suzuki", value: "maruti-suzuki" },
  { label: "Hyundai", value: "hyundai" },
  { label: "Tata", value: "tata" },
] as const;

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

/**
 * Sales lead details tab labels.
 */
export const salesLeadDetailTabs = ["Info", "Activity", "Notes"] as const;

/**
 * Sales lead status options for lead details.
 */
export const salesLeadStatusOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Interested", value: "interested" },
  { label: "Test Drive", value: "test-drive" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
] as const;

/**
 * Sales lead lost reason options for lead details.
 */
export const salesLeadLostReasonOptions = [
  { label: "Price Issue", value: "price-issue" },
  { label: "No Response", value: "no-response" },
  { label: "Bought Elsewhere", value: "bought-elsewhere" },
  { label: "Budget Mismatch", value: "budget-mismatch" },
] as const;

/**
 * Sales lead details payload.
 */
export const salesLeadDetails = {
  lead: {
    age: "32 yrs",
    avatarLabel: "VN",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    status: "Interested",
    statusTone: "purple" as const,
  },
  contactInfo: [
    {
      isHighlighted: true,
      key: "phone",
      label: "Phone",
      value: "9876876878",
    },
    {
      isHighlighted: false,
      key: "source",
      label: "Source",
      value: "CarWale",
    },
    {
      isHighlighted: false,
      key: "city",
      label: "City",
      value: "Mumbai",
    },
  ],
  carInterest: [
    {
      isHighlighted: true,
      key: "model",
      label: "Model",
      value: "Maruti Suzuki Swift",
    },
    {
      isHighlighted: false,
      key: "fuel",
      label: "Fuel Type",
      value: "Petrol",
    },
    {
      isHighlighted: false,
      key: "variant",
      label: "Variant",
      value: "ZXI+",
    },
  ],
} as const;

/**
 * Sales lead activity timeline dummy data.
 */
export const salesLeadActivities = [
  {
    description: "Follow-up call scheduled for tomorrow.",
    key: "act-1",
    meta: "Today, 10:30 AM",
    tone: "blue",
    type: "calendar",
  },
  {
    description: "Status changed to Interested.",
    key: "act-2",
    meta: "Today, 09:10 AM",
    tone: "purple",
    type: "status",
  },
  {
    description: "Lead received from CarWale.",
    key: "act-3",
    meta: "Yesterday, 06:42 PM",
    tone: "green",
    type: "lead",
  },
] as const;

/**
 * Sales lead notes panel dummy data.
 */
export const salesLeadNotes = [
  {
    author: "Rahul Sharma",
    key: "note-1",
    message: "Customer wants top-end variant and quick delivery timeline.",
    meta: "10:30 AM",
    variant: "outgoing",
  },
  {
    author: "Vikram Nair",
    key: "note-2",
    message: "Will confirm after discussing finance options with family.",
    meta: "09:50 AM",
    variant: "incoming",
  },
] as const;

/**
 * Add lead source dummy options.
 */
export const salesAddLeadSourceOptions = [
  { label: "CarWale", value: "carwale" },
  { label: "CarDekho", value: "cardekho" },
  { label: "Walk In", value: "walk-in" },
  { label: "Referral", value: "referral" },
] as const;

/**
 * Add lead car brand dummy options.
 */
export const salesAddLeadCarBrandOptions = [
  { label: "Maruti Suzuki", value: "maruti-suzuki" },
  { label: "Hyundai", value: "hyundai" },
  { label: "Tata", value: "tata" },
  { label: "Mahindra", value: "mahindra" },
] as const;

/**
 * Add lead car model dummy options.
 */
export const salesAddLeadCarModelOptions = [
  { label: "Swift", value: "swift" },
  { label: "Baleno", value: "baleno" },
  { label: "Brezza", value: "brezza" },
  { label: "WagonR", value: "wagonr" },
] as const;

/**
 * Add lead variant/category dummy options.
 */
export const salesAddLeadVariantOptions = [
  { label: "Base", value: "base" },
  { label: "Mid", value: "mid" },
  { label: "Top", value: "top" },
  { label: "Automatic", value: "automatic" },
] as const;

/**
 * Add lead budget dummy options.
 */
export const salesAddLeadBudgetOptions = [
  { label: "Under 5 Lakh", value: "under-5-lakh" },
  { label: "5 - 8 Lakh", value: "5-8-lakh" },
  { label: "8 - 12 Lakh", value: "8-12-lakh" },
  { label: "12+ Lakh", value: "12-plus-lakh" },
] as const;

/**
 * Import lead source tag options dummy data.
 */
export const salesImportLeadSourceTagOptions = [
  { label: "Skip / Mixed sources", value: "skip-mixed-sources" },
  { label: "CarWale", value: "carwale" },
  { label: "CarDekho", value: "cardekho" },
  { label: "Walk In", value: "walk-in" },
  { label: "Referral", value: "referral" },
] as const;

/**
 * Import expected columns dummy data.
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
 * Sales profile summary dummy data.
 */
export const salesProfileSummaryData = {
  avatarLabel: "RS",
  branch: "Mumbai Branch",
  joined: "Jan 2025",
  name: "Rahul Sharma",
  role: "Sales Executive",
  userId: "SP001",
} as const;

/**
 * Sales profile metric cards dummy data.
 */
export const salesProfileMetrics = [
  { helper: "Conversion", key: "rate", label: "RATE", tone: "blue", value: "19%" },
  { helper: "Converted", key: "won", label: "WON", tone: "green", value: "9" },
  { helper: "This month", key: "leads", label: "LEADS", tone: "neutral", value: "47" },
] as const;

/**
 * Sales profile menu dummy data.
 */
export const salesProfileMenuItems = [
  {
    icon: "edit-profile",
    key: "edit-profile",
    label: "Edit Profile",
    tone: "blue",
  },
  {
    icon: "change-password",
    key: "change-password",
    label: "Change Password",
    tone: "amber",
  },
  {
    icon: "notifications",
    key: "notifications",
    label: "Notification Preferences",
    tone: "purple",
  },
  {
    icon: "performance",
    key: "performance",
    label: "My Performance Report",
    tone: "green",
  },
  {
    icon: "logout",
    key: "logout",
    label: "Logout",
    tone: "red",
  },
] as const;

/**
 * Sales profile edit language options dummy data.
 */
export const salesProfileLanguageOptions = [
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Marathi", value: "marathi" },
] as const;

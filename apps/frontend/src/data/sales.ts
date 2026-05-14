/**
 * Sales filter tag dummy data.
 */
export const salesLeadFilterTags = [
  { count: 12, key: "all", label: "All" },
  { count: 4, key: "new", label: "New" },
  { count: 3, key: "contacted", label: "Contacted" },
  { count: 2, key: "interested", label: "Interested" },
] as const;

/**
 * Sales phase tab dummy data.
 */
export const salesPhaseTabs = [
  { count: 12, key: "all", label: "All" },
  { count: 4, key: "new", label: "New" },
  { count: 3, key: "contacted", label: "Contacted" },
  { count: 2, key: "interested", label: "Interested" },
  { count: 1, key: "won", label: "Won" },
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
    statusLabel: "Won",
    statusTone: "green",
    vehicleName: "Maruti Suzuki Swift",
  },
] as const;

/**
 * Sales status filter dummy options.
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
 * Sales source filter dummy options.
 */
export const salesSourceFilterOptions = [
  "All",
  "CarWale",
  "CarDekho",
  "Walk In",
  "Referral",
] as const;

/**
 * Sales branch filter dummy options.
 */
export const salesBranchOptions = [
  { label: "All Showrooms", value: "all-showrooms" },
  { label: "Thane", value: "thane" },
  { label: "Mumbai", value: "mumbai" },
] as const;

/**
 * Sales car brand filter dummy options.
 */
export const salesCarBrandOptions = [
  { label: "All Brands", value: "all-brands" },
  { label: "Maruti Suzuki", value: "maruti-suzuki" },
  { label: "Hyundai", value: "hyundai" },
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
 * Sales lead details dummy data.
 */
export const salesLeadDetails = {
  contactInfo: [
    { isHighlighted: true, key: "phone", label: "Phone", value: "9876543210" },
    {
      isHighlighted: false,
      key: "email",
      label: "Email",
      value: "vikram.nair@gmail.com",
    },
    { isHighlighted: false, key: "source", label: "Source", value: "CarWale" },
  ],
  carInterest: [
    {
      isHighlighted: true,
      key: "brand",
      label: "Brand",
      value: "Maruti Suzuki",
    },
    { isHighlighted: false, key: "model", label: "Model", value: "Swift ZXI+" },
    {
      isHighlighted: false,
      key: "colour",
      label: "Colour Pref.",
      value: "Midnight Blue",
    },
    { isHighlighted: false, key: "budget", label: "Budget", value: "₹8–9 Lakh" },
  ],
  lead: {
    age: "2 days ago",
    avatarLabel: "VN",
    name: "Vikram Nair",
    phoneNumber: "9876876878",
    status: "Contacted",
    statusTone: "amber",
  },
} as const;

/**
 * Lead detail tab dummy options.
 */
export const salesLeadDetailTabs = ["Info", "Activity", "Notes"] as const;

/**
 * Lead status dummy options.
 */
export const salesLeadStatusOptions = [
  { label: "Contacted", value: "contacted" },
  { label: "New", value: "new" },
  { label: "Interested", value: "interested" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
] as const;

/**
 * Lead lost reason dummy options.
 */
export const salesLeadLostReasonOptions = [
  { label: "Select Lost Reason", value: "select-lost-reason" },
  { label: "Budget issue", value: "budget-issue" },
  { label: "Not interested", value: "not-interested" },
  { label: "Bought another car", value: "bought-another-car" },
] as const;

/**
 * Lead activity timeline dummy data.
 */
export const salesLeadActivities = [
  {
    description: "Called - Not answered. Tried 2 times.",
    key: "called-not-answered",
    meta: "Today, 10:30 AM · Rahul",
    tone: "blue",
    type: "call",
  },
  {
    description: "WhatsApp sent - Swift brochure + EMI sheet shared.",
    key: "whatsapp-brochure",
    meta: "Yesterday, 3:15 PM · Rahul",
    tone: "green",
    type: "whatsapp",
  },
  {
    description: "Test drive enquired — customer asked about weekend slots.",
    key: "test-drive-enquiry",
    meta: "Yesterday, 2:40 PM · Rahul",
    tone: "purple",
    type: "calendar",
  },
  {
    description: "Status changed: New → Contacted",
    key: "status-changed",
    meta: "Yesterday, 3:10 PM · Rahul",
    tone: "amber",
    type: "status",
  },
  {
    description: "Lead created via CarWale import.",
    key: "lead-created",
    meta: "2 days ago · System",
    tone: "neutral",
    type: "lead",
  },
] as const;

/**
 * Lead notes dummy data.
 */
export const salesLeadNotes = [
  {
    author: "Rahul",
    key: "emi-options",
    message:
      "Customer asked about EMI options for Swift. Seems interested in a 5-year plan. Wife also coming for test drive.",
    meta: "2 days ago",
    variant: "incoming",
  },
  {
    author: "You",
    key: "emi-calculator",
    message:
      "Shared EMI calculator on WhatsApp. Follow up tomorrow morning before 10am.",
    meta: "Yesterday",
    variant: "outgoing",
  },
  {
    author: "Rahul",
    key: "not-picking-up",
    message: "Not picking up. Will try again in the evening, post 6pm.",
    meta: "Today",
    variant: "incoming",
  },
  {
    author: "You",
    key: "test-drive-slot",
    message:
      "Called at 7pm — spoke for 5 mins. He wants Midnight Blue. Will confirm slot for test drive this Saturday.",
    meta: "Today, 7:08 PM",
    variant: "outgoing",
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

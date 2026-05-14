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

/**
 * Sales notification preference group dummy data.
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
 * Sales notification quiet hours options dummy data.
 */
export const salesNotificationQuietHoursTimeOptions = [
  { label: "10:00 PM", value: "10-pm" },
  { label: "11:00 PM", value: "11-pm" },
  { label: "12:00 AM", value: "12-am" },
  { label: "8:00 AM", value: "8-am" },
  { label: "9:00 AM", value: "9-am" },
] as const;

/**
 * Sales performance top metric cards dummy data.
 */
export const salesPerformanceTopMetrics = [
  { helper: "", key: "total-leads", label: "TOTAL LEADS", tone: "neutral", value: "47" },
  { helper: "", key: "calls-made", label: "CALLS MADE", tone: "neutral", value: "134" },
  { helper: "19% rate", key: "won", label: "WON 🎉", tone: "green", value: "9" },
  { helper: "25% lost", key: "lost", label: "LOST", tone: "red", value: "12" },
] as const;

/**
 * Sales performance pipeline progress dummy data.
 */
export const salesPerformancePipelineProgress = [
  { colorClassName: "bg-blue-600", count: 4, key: "new", label: "New", progress: 9 },
  { colorClassName: "bg-amber-500", count: 12, key: "contacted", label: "Contacted", progress: 26 },
  { colorClassName: "bg-purple-600", count: 8, key: "interested", label: "Interested", progress: 17 },
  { colorClassName: "bg-sky-700", count: 2, key: "test-drive", label: "Test Drive", progress: 4 },
  { colorClassName: "bg-green-500", count: 9, key: "won", label: "Won", progress: 19 },
] as const;

/**
 * Sales performance weekly calls vs leads chart dummy data.
 */
export const salesPerformanceWeeklyCallsLeads = [
  { calls: 15, day: "Mon", key: "mon", leads: 4 },
  { calls: 22, day: "Tue", key: "tue", leads: 6 },
  { calls: 18, day: "Wed", key: "wed", leads: 5 },
  { calls: 20, day: "Thu", key: "thu", leads: 7 },
  { calls: 14, day: "Fri", key: "fri", leads: 3 },
  { calls: 10, day: "Sat", key: "sat", leads: 2 },
  { calls: 6, day: "Sun", key: "sun", leads: 1 },
] as const;

/**
 * Sales performance source breakdown dummy data.
 */
export const salesPerformanceSourceBreakdown = [
  { colorClassName: "bg-blue-600", count: 18, key: "carwale", source: "CarWale" },
  { colorClassName: "bg-green-500", count: 14, key: "cardekho", source: "CarDekho" },
  { colorClassName: "bg-amber-500", count: 9, key: "walk-in", source: "Walk In" },
  { colorClassName: "bg-purple-500", count: 6, key: "referral", source: "Referral" },
] as const;

# �� Sales Person: Profile & Settings

## Goal
Build the Profile menu, Edit Profile, Change Password, Notification Preferences, and My Performance screens for the Sales Person role.

---

## 8.1 — Profile Menu

### Screen: `/profile`
### File: `src/app/(sales)/profile/page.tsx`

**Header section:**
- Large avatar (initials circle, blue background)
- Full Name
- User ID + Role (e.g. "SP001 · Sales Executive")
- Branch + Join date

**Menu Items (list):**
- Edit Profile
- Change Password
- Notification Preferences
- My Performance Report
- Logout (red text)

Each item is a tappable row with chevron (→), except Logout which shows a destructive red color.

---

## 8.2 — Edit Profile

### Screen: `/profile/edit`
### File: `src/app/(sales)/profile/edit/page.tsx`

**Header:** Back arrow + "Edit Profile" + "Save" button (top right)

**Avatar section:**
- Avatar circle with initials
- "Change Photo" text button below

**Editable Fields:**
| Field | Type |
|-------|------|
| Full Name | Text |
| Phone Number | Tel |
| Email | Email |
| Language Preference | Select (English, Hindi, etc.) |

**Read-only Fields (shown as info rows):**
- User ID
- Role
- Branch
- Joined date

**Save button** calls `updateProfileRequest()`.

---

## 8.3 — Change Password

### Screen: `/profile/change-password`
### File: `src/app/(sales)/profile/change-password/page.tsx`

**Header:** Back arrow + "Change Password"

**Fields:**
| Field | Type |
|-------|------|
| Current Password | Password input |
| New Password | Password input |
| Confirm New Password | Password input |

**Save Changes** button — calls `changePasswordRequest()`.

Reuse `validatePasswordService` from  for new password validation.

---

## 8.4 — Notification Preferences

### Screen: `/profile/notifications`
### File: `src/app/(sales)/profile/notifications/page.tsx`

**Header:** Back arrow + "Notifications"

Banner: "Notifications help you never miss a follow-up or status change."

**FOLLOW-UP REMINDERS section:**
| Toggle | Description |
|--------|-------------|
| Overdue follow-ups | When a lead hasn't been contacted in 3+ days |
| Test drive reminders | 1 hour before a scheduled test drive |
| New lead assigned | When admin assigns a lead to you |

**LEAD UPDATES section:**
| Toggle | Description |
|--------|-------------|
| Status change alerts | When a lead moves to a new phase |
| Won / Lost summary | End-of-day win/loss notification |

**HOW TO NOTIFY section:**
| Toggle | |
|--------|--|
| Push notification | |
| SMS | |
| WhatsApp | |

**QUIET HOURS section:**
- Enable quiet hours toggle
- FROM time picker
- TO time picker

---

## 8.5 — My Performance

### Screen: `/performance`
### File: `src/app/(sales)/performance/page.tsx`

**Header:** Back arrow + "My Performance" + month picker dropdown (e.g. "This Month ▾")

**Hero Card (blue background):**
- Avatar + Name
- User ID + month
- Rank badge (e.g. "🏆 Rank #1")

**Stats Row:**
| Stat | |
|------|--|
| Total Leads | |
| Calls Made | |

**Won / Lost Row:**
| | |
|--|--|
| Won (count + rate) | Lost (count + % lost) |

**Pipeline Progress** — horizontal bar for each stage showing count:
- New
- Contacted
- Interested
- Test Drive
- Won

**Weekly Calls vs Leads** — bar chart (Recharts):
- X axis: Mon–Sun
- Two bars: Calls (blue) + Leads (gray)

**Source Breakdown** — list with color dot + source name + count:
- CarWale, CarDekho, Walk In, Referral, etc.

---

## 8.6 — Types

```ts
// src/types/performance.data.ts

/**
 * Sales performance data for a given period
 */
export interface PerformanceData {
  totalLeads: number;
  callsMade: number;
  won: number;
  wonRate: number;
  lost: number;
  lostRate: number;
  rank?: number;
  pipeline: Record<LeadStatusType, number>;
  weeklyActivity: WeeklyActivityData[];
  sourceBreakdown: SourceBreakdownData[];
}

export interface WeeklyActivityData {
  day: string;
  calls: number;
  leads: number;
}

export interface SourceBreakdownData {
  source: LeadSourceType;
  count: number;
}
```

---

## 8.7 — Requests

```ts
// src/requests/profile.request.ts

/**
 * Updates the logged-in user's profile info
 */
export async function updateProfileRequest(payload: Partial<UserData>): Promise<{
  data: UserData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Changes the logged-in user's password
 */
export async function changePasswordRequest(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ data: { success: boolean } | null; error: Error | null }> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Saves notification preference settings
 */
export async function updateNotificationPreferencesRequest(payload: NotificationPreferencesData): Promise<{
  data: { success: boolean } | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches performance data for the logged-in user for a given period
 */
export async function getMyPerformanceRequest(period: string): Promise<{
  data: PerformanceData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## Checklist

- [ ] Profile menu page with avatar, user info, nav list
- [ ] Edit Profile page (editable fields + read-only info)
- [ ] Change Password page (reuse password validation)
- [ ] Notification Preferences page (all toggles + quiet hours)
- [ ] My Performance page:
  - [ ] Hero card with rank
  - [ ] Stats row
  - [ ] Won/Lost row
  - [ ] Pipeline progress bars
  - [ ] Weekly Calls vs Leads bar chart (Recharts)
  - [ ] Source breakdown list
- [ ] `PerformanceData`, `WeeklyActivityData`, `SourceBreakdownData` types
- [ ] Requests: `updateProfileRequest`, `changePasswordRequest`, `updateNotificationPreferencesRequest`, `getMyPerformanceRequest`

---

**← [Lead Forms](./lead_forms.md) | [Admin Dashboard →](./admin_dashboard.md)**

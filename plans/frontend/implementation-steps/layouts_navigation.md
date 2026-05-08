# �� Layouts & Navigation

## Goal
Build the shell layouts for both roles — bottom navigation bar, page header component, and route guards. All feature screens from  onward will live inside these layouts.

---

## 3.1 — Sales Person Layout

### File: `src/app/(sales)/layout.tsx`

**Bottom Navigation Tabs (5 items):**

| Icon | Label | Route |
|------|-------|-------|
| Home | Home | `/dashboard` |
| Users | Leads | `/leads` |
| Circle (active indicator) | — | — |
| Bell | Alerts | `/notifications` |
| Person | Profile | `/profile` |

**Design notes:**
- Fixed at bottom of screen
- Active tab: blue icon + blue label
- Inactive tab: gray icon + gray label
- The center tab (index 2) is a raised blue circle — this is the "Quick Add" or active lead indicator from the design

**Route Guard:**
- Check for auth token
- Check role === "sales"
- If not authenticated → redirect to `/login`
- If role === "admin" → redirect to `/admin/dashboard`

```tsx
/** Sales Person app shell with bottom navigation */
export default function SalesLayout({ children }: { children: React.ReactNode }) {
  // Define Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Define States
  // (auth check happens here or in middleware)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <SalesBottomNav pathname={pathname} />
    </div>
  );
}
```

### Component: `src/components/layout/SalesBottomNav.tsx`

---

## 3.2 — Admin Layout

### File: `src/app/(admin)/layout.tsx`

**Bottom Navigation Tabs (5 items):**

| Icon | Label | Route |
|------|-------|-------|
| Home | Dashboard | `/admin/dashboard` |
| Users | Team | `/admin/team` |
| Chart | Reports | `/admin/reports` |
| Referrers (heart/star) | Referrers | `/admin/referrers` |
| Person | Profile | `/admin/profile` |

**Route Guard:**
- Check for auth token
- Check role === "admin"
- If not authenticated → redirect to `/login`
- If role === "sales" → redirect to `/dashboard`

### Component: `src/components/layout/AdminBottomNav.tsx`

---

## 3.3 — Page Header Component

Used on most inner screens.

### File: `src/components/layout/PageHeader.tsx`

**Props:**
```ts
interface PageHeaderData {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}
```

**Design:**
- White background
- Left: back arrow (if `showBack`) or nothing
- Center: title text (bold, ~16px)
- Right: optional action (icon button for filter/settings/edit)
- Subtle bottom border

---

## 3.4 — Middleware (Route Protection)

### File: `src/middleware.ts`

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects all routes except auth pages.
 * Redirects unauthenticated users to /login.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("autolead_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-otp") ||
    pathname.startsWith("/new-password");

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    // Redirect already-logged-in users away from auth pages
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

> Note: Token storage strategy should align with backend — cookie-based is preferred for middleware access.

---

## 3.5 — Shared Layout Components

### `src/components/shared/StatCard.tsx`
Reusable card for displaying a number + label (used in dashboards).

```ts
interface StatCardData {
  label: string;
  value: number | string;
  highlight?: boolean; // blue background variant
}
```

### `src/components/shared/EmptyState.tsx`
Shown when lists have no data.

```ts
interface EmptyStateData {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

### `src/components/shared/LoadingSpinner.tsx`
Centered spinner for page-level loading states.

### `src/components/shared/Avatar.tsx`
Initials-based avatar with color background — used in lead cards and profiles.

```ts
interface AvatarData {
  name: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string;
}
```

---

## 3.6 — Lead Status Badge Component

Used across leads list and lead detail screens.

### File: `src/components/leads/LeadStatusBadge.tsx`

```ts
interface LeadStatusBadgeData {
  status: LeadStatusType;
}
```

Status → Color mapping:
```ts
// src/constants/lead-status.constants.ts (extend with colors)
export const LEAD_STATUS_COLORS: Record<LeadStatusType, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-orange-100 text-orange-700",
  Interested: "bg-purple-100 text-purple-700",
  "Test Drive": "bg-teal-100 text-teal-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};
```

---

## Checklist

- [ ] Sales layout with bottom nav (5 tabs, active state)
- [ ] Admin layout with bottom nav (5 tabs, active state)
- [ ] `SalesBottomNav` component
- [ ] `AdminBottomNav` component
- [ ] `PageHeader` component (back arrow, title, right action)
- [ ] `middleware.ts` for route protection
- [ ] `StatCard` shared component
- [ ] `EmptyState` shared component
- [ ] `LoadingSpinner` shared component
- [ ] `Avatar` shared component (initials-based)
- [ ] `LeadStatusBadge` component with color map

---

**← [Auth](./authentication.md) | [Sales Dashboard →](./sales_dashboard.md)**

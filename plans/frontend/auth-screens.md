# Frontend – Auth Screens Plan

> Covers the four screens in the **Auth Flow** section of the Figma file (node `176:3`).  
> Figma file: `GaadiWalo` · file key `2ecwluKtudiEzivvKk8GTs`

---

## Overview

GaadiWalo's auth module is a **closed, credential-based** flow. There is no self-registration — accounts are provisioned by an admin. Users log in with a **User ID** (e.g. `SP001`) and password. Password reset is OTP-driven.

### Screen inventory

| # | Screen | Figma node | Route (proposed) |
|---|--------|-----------|------------------|
| 1 | Login | `124:17` | `/login` |
| 2 | Reset Password | `124:64` | `/forgot-password` |
| 3 | Verify OTP | `124:85` | `/verify-otp` |
| 4 | New Password | `124:110` | `/new-password` |

### User flow

```
/login
  └─ [Forgot Password?]
        └─ /forgot-password
              └─ [Send OTP]
                    └─ /verify-otp
                          └─ [Verify OTP]
                                └─ /new-password
                                      └─ [Set New Password]
                                            └─ /login  (success toast)
```

---

## Screen-by-Screen Breakdown

### 1. Login (`/login`)

**Design notes (Figma `124:17`):**
- Blue gradient header (~30% of viewport height) with app logo icon, app name **AutoLead**, and subtitle *Car Sales CRM*.
- White card (rounded top corners, shadow) occupies remaining ~70%.
- Heading: "Welcome back 👋", sub-heading: "Sign in to your account".
- **USER ID** text input — placeholder `SP001`.
- **PASSWORD** text input — masked, with show/hide toggle (eye icon, right-aligned inside field).
- Right-aligned link: **"Forgot Password?"** in primary blue.
- Full-width primary CTA: **"Sign In"**.

**Component requirements:**
- `<TextInput>` — reusable, supports `label`, `placeholder`, `error`, `type`.
- `<PasswordInput>` — extends `<TextInput>`, adds show/hide toggle.
- `<PrimaryButton>` — full-width, loading state (spinner while API call is in-flight).
- `<AppHeader>` — blue gradient header with logo + app name (reused across all auth screens is not needed — only Login has this variant).

**State:**
```ts
userId: string
password: string
showPassword: boolean
isLoading: boolean
error: string | null  // "Invalid credentials" etc.
```

**Validation (client-side):**
- Both fields required before enabling Sign In.
- No specific format constraint on User ID (flexible, e.g. `SP001`, `ADM01`).
- Password: non-empty only (full rules apply on the New Password screen).

**On submit:**
1. Disable button, show spinner.
2. Call `POST /api/auth/login`.
3. On success → store tokens → navigate to app home (e.g. `/dashboard`).
4. On failure → show inline error below the form.

---

### 2. Reset Password (`/forgot-password`)

**Design notes (Figma `124:64`):**
- Standard white screen with a back arrow `←` and title **"Reset Password"** in the top nav bar.
- Blue info banner (with `ℹ` icon): *"Enter your registered email or phone number. We'll send a reset link or OTP to verify your identity."*
- **EMAIL OR PHONE** text input — placeholder `e.g. rahul@company.com`.
- Full-width primary CTA: **"Send OTP"**.

**Component requirements:**
- `<NavHeader>` — back button + title string (reused by screens 2, 3, 4).
- `<InfoBanner>` — icon + body text, light-blue background variant.
- `<TextInput>` (reused).
- `<PrimaryButton>` (reused).

**State:**
```ts
emailOrPhone: string
isLoading: boolean
error: string | null
```

**Validation:**
- Non-empty.
- Basic format check: if contains `@` → validate as email, otherwise validate as 10-digit phone number.

**On submit:**
1. Call `POST /api/auth/forgot-password` with `{ identifier: emailOrPhone }`.
2. On success → navigate to `/verify-otp`, passing `identifier` via route state (not URL — do not expose in query params).
3. On failure → show inline error.

Current backend scope note:
- Password recovery is email-only in the current backend implementation phase.
- Phone-based recovery copy may remain in UI drafts, but the API currently accepts email identifiers only.

---

### 3. Verify OTP (`/verify-otp`)

**Design notes (Figma `124:85`):**
- `<NavHeader>` with back arrow + title **"Verify OTP"**.
- Keyboard/phone icon centered.
- Heading: **"OTP Sent!"**, sub-text: *"Enter the 6-digit OTP sent to ra●●●●●●●com"* (masked identifier).
- **Six individual single-digit input boxes** in a row.
- Full-width CTA: **"Verify OTP"**.
- Below: *"Didn't receive? Resend in 0:45"* — countdown timer; once it hits 0:00, the text changes to a tappable **"Resend OTP"** link.

**Component requirements:**
- `<OTPInput>` — 6-box controlled input; auto-focuses next box on digit entry; handles backspace to move to previous box; paste of a full 6-digit string should populate all boxes.
- `<CountdownResend>` — 45-second countdown; becomes an active "Resend OTP" button at 0.

**State:**
```ts
otp: string[]  // length 6
isLoading: boolean
error: string | null
countdown: number       // seconds remaining (starts at 45)
canResend: boolean
identifier: string      // passed from previous screen (masked for display)
```

**Masking logic (display only):**
- Email: show first 2 chars, mask middle, show domain `ra●●●●●●●●●●●com`.
- Phone: show first 2 and last 2 digits, mask middle.

**On submit:**
1. Call `POST /api/auth/verify-otp` with `{ identifier, otp: otp.join('') }`.
2. On success → receive a short-lived `resetToken`; navigate to `/new-password` passing `resetToken` via route state.
3. On failure (wrong OTP) → shake animation on boxes, show error, clear inputs.

**Resend:**
- Call `POST /api/auth/resend-otp` with `{ identifier }`.
- Restart countdown to 45 seconds.

---

### 4. New Password (`/new-password`)

**Design notes (Figma `124:110`):**
- `<NavHeader>` with back arrow + title **"New Password"**.
- **NEW PASSWORD** input — placeholder *"At least 8 characters"*, show/hide toggle.
- **CONFIRM PASSWORD** input — placeholder *"Re-enter password"*, show/hide toggle.
- Live password requirements checklist:
  - ✓ Minimum 8 characters (green checkmark when met)
  - ○ One uppercase letter (grey circle → green checkmark when met)
  - ○ One number (grey circle → green checkmark when met)
- Full-width CTA: **"Set New Password"**.

**Component requirements:**
- `<PasswordInput>` (reused).
- `<PasswordStrengthChecklist>` — receives password string, renders rule rows with pass/fail state.

**State:**
```ts
newPassword: string
confirmPassword: string
showNew: boolean
showConfirm: boolean
isLoading: boolean
error: string | null
resetToken: string   // passed from Verify OTP screen

// Derived (not stored)
rules: { minLength: boolean; hasUppercase: boolean; hasNumber: boolean }
isValid: boolean     // all rules pass AND passwords match
```

**Validation:**
- Min 8 characters.
- At least one uppercase letter.
- At least one number.
- `confirmPassword === newPassword`.
- CTA is **disabled** until `isValid === true`.

**On submit:**
1. Call `POST /api/auth/reset-password` with `{ resetToken, newPassword }`.
2. On success → navigate to `/login` with a success toast: *"Password updated successfully. Please sign in."*
3. On failure → show inline error.

---

## API Integration

All auth endpoints live under `/api/auth`. The frontend expects JSON responses.

### Endpoints

#### `POST /api/auth/login`
```
Request:
{
  "userId": "SP001",
  "password": "••••••"
}

Response 200:
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": {
    "id": "SP001",
    "name": "Salesperson Name",
    "role": "salesperson" | "manager" | "admin"
  }
}

Response 401:
{ "error": "Invalid credentials" }

Response 429:
{ "error": "Too many attempts. Try again in X minutes." }
```

#### `POST /api/auth/forgot-password`
```
Request:
{ "identifier": "rahul@company.com" | "9876543210" }

Response 200:
{ "message": "OTP sent" }

Response 404:
{ "error": "No account found with this email or phone" }
```

#### `POST /api/auth/verify-otp`
```
Request:
{
  "identifier": "rahul@company.com",
  "otp": "123456"
}

Response 200:
{ "resetToken": "<short-lived-token>" }

Response 400:
{ "error": "Invalid or expired OTP" }
```

#### `POST /api/auth/resend-otp`
```
Request:
{ "identifier": "rahul@company.com" }

Response 200:
{ "message": "OTP resent" }

Response 429:
{ "error": "Please wait before requesting another OTP" }
```

#### `POST /api/auth/reset-password`
```
Request:
{
  "resetToken": "<token-from-verify-otp>",
  "newPassword": "NewPass1!"
}

Response 200:
{ "message": "Password updated successfully" }

Response 400:
{ "error": "Reset token expired or invalid" }
```

#### `POST /api/auth/logout`
```
Request: (no body — uses auth header or cookie)

Response 200:
{ "message": "Logged out" }
```

#### `POST /api/auth/refresh`
```
Request:
{ "refreshToken": "<token>" }

Response 200:
{ "accessToken": "<new-jwt>" }

Response 401:
{ "error": "Refresh token expired" }
```

---

## Token Management

| Concern | Decision |
|---------|----------|
| Access token storage | Client stores only the backend-returned auth context needed by the current flow. |
| Refresh token storage | Not implemented in the current backend auth phase. |
| Token refresh strategy | Deferred until refresh/logout endpoints are implemented. |
| Logout | Deferred until backend logout support is added. |

---

## Auth Context / State Management

A global `AuthContext` (React Context + useReducer, or Zustand slice) should expose:

```ts
interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean   // true during initial token check on app mount
}

interface AuthActions {
  login(userId: string, password: string): Promise<void>
  logout(): Promise<void>
  refreshToken(): Promise<void>
}
```

On app mount: check if a refresh token cookie exists by calling `/auth/refresh` silently. Set `isLoading = true` during this check. This prevents the flash of unauthenticated content.

---

## Protected Routes

```tsx
// Wrap all non-auth routes with this
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

- If `isAuthenticated === false` and `isLoading === false` → redirect to `/login`.
- If `isLoading === true` → show a full-screen spinner.

Auth routes (`/login`, `/forgot-password`, `/verify-otp`, `/new-password`) should redirect to `/dashboard` if the user is already authenticated.

---

## Shared UI Components (Auth scope)

| Component | Props | Notes |
|-----------|-------|-------|
| `AppAuthHeader` | `title`, `subtitle`, `icon` | Blue gradient header — Login screen only |
| `NavHeader` | `title`, `onBack` | Top bar with back arrow — screens 2, 3, 4 |
| `TextInput` | `label`, `value`, `onChange`, `placeholder`, `error`, `type` | Base input |
| `PasswordInput` | extends `TextInput` | Adds eye toggle |
| `OTPInput` | `value: string[]`, `onChange`, `length = 6` | Auto-advance, backspace, paste |
| `PrimaryButton` | `label`, `onPress`, `isLoading`, `disabled` | Blue full-width CTA |
| `InfoBanner` | `message` | Blue-bg info box with ℹ icon |
| `PasswordStrengthChecklist` | `password` | Live rule checker |
| `CountdownResend` | `initialSeconds`, `onResend` | 45s timer → Resend link |

---

## Design Tokens (from Figma)

| Token | Value |
|-------|-------|
| Primary blue | `#2D4EE8` (approx — verify exact hex from Figma variables) |
| Background | `#F5F5F7` (light grey screen bg) |
| Card white | `#FFFFFF` |
| Text primary | `#0D0D12` |
| Text secondary | `#6B7280` |
| Error red | `#EF4444` |
| Success green | `#22C55E` |
| Input border | `#E5E7EB` |
| Input border focus | Primary blue |
| Border radius (card) | `24px` (top rounded, Login screen card) |
| Border radius (input) | `10px` |
| Border radius (button) | `12px` |

---

## Error Handling — User-Facing Messages

| API error | Display location | Message |
|-----------|-----------------|---------|
| 401 Invalid credentials | Below form (Login) | "Invalid User ID or password." |
| 404 Identifier not found | Below form (Reset) | "No account found with this email or phone." |
| 400 Wrong OTP | Below OTP boxes | "Incorrect OTP. Please try again." |
| 400 OTP expired | Below OTP boxes | "OTP has expired. Please request a new one." |
| 400 Reset token invalid | Below form (New Pwd) | "Session expired. Please restart the password reset." |
| 429 Too many attempts | Below form | "Too many attempts. Try again in X minutes." |
| Network / 500 error | Below form | "Something went wrong. Please check your connection." |

---

## Edge Cases & UX Considerations

1. **Back navigation from Verify OTP / New Password** — pressing back should NOT re-trigger an OTP send. State passed via route state must be preserved or the user is sent back to start.
2. **OTP auto-submit** — when the 6th digit is entered, auto-call "Verify OTP" (no need to tap the button).
3. **Keyboard behaviour** — on mobile: numeric keyboard for OTP boxes, default keyboard for email/phone.
4. **Deep-link protection** — `/verify-otp` and `/new-password` must require the preceding step's state; if accessed directly (e.g. browser back/forward), redirect to `/forgot-password`.
5. **Brute force** — the backend must implement rate limiting (5 attempts then lockout); the frontend should surface the lockout error and disable the form for the lockout duration.
6. **Accessibility** — all inputs must have proper `aria-label`; OTP boxes should be announced individually (e.g. "Digit 1 of 6").

---

## Development Tasks Checklist

### Setup
- [ ] Decide and scaffold frontend framework (React Native / React Native Expo — most likely given the mobile frame in Figma)
- [ ] Set up routing library (Expo Router or React Navigation)
- [ ] Set up global state (Zustand or Context + Reducer)
- [ ] Set up HTTP client (Axios with interceptors for token refresh)
- [ ] Configure environment variables (`API_BASE_URL`, etc.)

### Shared components
- [ ] `TextInput`
- [ ] `PasswordInput`
- [ ] `PrimaryButton`
- [ ] `NavHeader`
- [ ] `InfoBanner`
- [ ] `OTPInput`
- [ ] `CountdownResend`
- [ ] `PasswordStrengthChecklist`
- [ ] `AppAuthHeader` (Login header)

### Screens
- [ ] Login screen
- [ ] Reset Password screen
- [ ] Verify OTP screen
- [ ] New Password screen

### Auth logic
- [ ] `AuthContext` / Zustand auth slice
- [ ] `ProtectedRoute` / auth guard
- [ ] Token refresh interceptor
- [ ] App-mount token check (silent refresh on open)
- [ ] Logout flow

### API integration
- [ ] `POST /auth/login`
- [ ] `POST /auth/forgot-password`
- [ ] `POST /auth/verify-otp`
- [ ] `POST /auth/resend-otp`
- [ ] `POST /auth/reset-password`
- [ ] `POST /auth/logout`
- [ ] `POST /auth/refresh`

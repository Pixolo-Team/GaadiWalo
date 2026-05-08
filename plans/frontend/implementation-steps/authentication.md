# �� Authentication

## Goal
Build all 4 authentication screens: Login, Forgot Password, Verify OTP, and Set New Password. These are shared by both Sales Person and Admin roles.

---

## Screens in this Step

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/login` | User ID + Password, role toggle (Sales Person / Admin), Forgot Password link |
| Forgot Password | `/forgot-password` | Email or phone input, Send OTP button |
| Verify OTP | `/verify-otp` | 6-digit OTP input, Verify OTP button, Resend countdown |
| New Password | `/new-password` | New Password + Confirm Password with validation rules |

---

## 2.1 — Auth Layout

### File: `src/app/(auth)/layout.tsx`

- Full-screen centered layout
- White card with rounded corners and subtle shadow
- AutoLead logo + "Car Sales CRM" subtitle at top
- No bottom navigation

```tsx
/** Auth layout – wraps all authentication screens */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Logo section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3">
            {/* Car icon */}
          </div>
          <h1 className="text-xl font-bold text-gray-900">AutoLead</h1>
          <p className="text-sm text-gray-500">Car Sales CRM</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

---

## 2.2 — Login Page

### File: `src/app/(auth)/login/page.tsx`

**UI Elements:**
- "Welcome back 👋" heading
- "Sign in to your account" subtitle
- **User ID** input field (text)
- **Password** input field (password, with show/hide toggle)
- "Forgot Password?" link → navigates to `/forgot-password`
- **Sign In** button (full width, blue)
- Role toggle at the bottom: `Sales Person` | `Admin` (tab-style selector)

**Behavior:**
- Role selection changes the redirect destination after login:
  - Sales Person → `/dashboard`
  - Admin → `/admin/dashboard`
- Form validation: both fields required
- On submit: call `loginRequest()`
- Show loading state on button while submitting
- On error: show toast with error message

**Types:**
```ts
// src/types/auth.data.ts
export interface LoginFormData {
  userId: string;
  password: string;
  role: "sales" | "admin";
}

export interface LoginResponseData {
  token: string;
  user: UserData;
}
```

**Service:**
```ts
// src/services/auth.service.ts

/**
 * Handles post-login redirect based on user role
 */
export function resolveLoginRedirectService(role: "sales" | "admin"): string {
  return role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.SALES_DASHBOARD;
}
```

**Request:**
```ts
// src/requests/auth.request.ts

/**
 * Authenticates user with userId and password
 */
export async function loginRequest(payload: LoginFormData): Promise<{ data: LoginResponseData | null; error: Error | null }> {
  try {
    // API call here
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## 2.3 — Forgot Password Page

### File: `src/app/(auth)/forgot-password/page.tsx`

**UI Elements:**
- Back arrow (← navigates back)
- "Reset Password" heading
- Info text: "Enter your registered email or phone number. We'll send a reset link or OTP to verify your identity."
- **Email or Phone** input field
- **Send OTP** button (full width, blue)

**Behavior:**
- Validates input (not empty, basic email or 10-digit phone format)
- On submit: call `sendOtpRequest()`
- On success: navigate to `/verify-otp` passing the email/phone as query param or via session state

**Request:**
```ts
/**
 * Sends OTP to the provided email or phone for password reset
 */
export async function sendOtpRequest(identifier: string): Promise<{ data: { success: boolean } | null; error: Error | null }> {
  try {
    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## 2.4 — Verify OTP Page

### File: `src/app/(auth)/verify-otp/page.tsx`

**UI Elements:**
- Back arrow
- "Verify OTP" heading
- Subtitle: "Enter the 6-digit OTP sent to {masked identifier}"
- **6-digit OTP input** — 6 separate single-character boxes, auto-focus next on input
- **Verify OTP** button
- "Didn't receive? **Resend in 0:45**" — countdown timer, becomes clickable link when timer hits 0

**Behavior:**
- Auto-advance focus from box to box as digits are entered
- Backspace moves focus to previous box
- Paste support: pasting 6 digits fills all boxes
- Countdown timer starts at 45 seconds
- On verify: call `verifyOtpRequest()`
- On success: navigate to `/new-password`

**Component:**
```ts
// src/components/auth/OtpInput.tsx
// 6 individual inputs with auto-focus logic
```

---

## 2.5 — New Password Page

### File: `src/app/(auth)/new-password/page.tsx`

**UI Elements:**
- Back arrow
- "New Password" heading
- **New Password** input (password, with show/hide)
- **Confirm Password** input (password, with show/hide)
- Password validation checklist (shown live below input):
  - ✅ Minimum 8 characters
  - ✅ One uppercase letter
  - ✅ One number
- **Set New Password** button (disabled until all rules pass)

**Behavior:**
- Live validation: each rule turns green as it's satisfied
- Confirm password must match new password
- On submit: call `resetPasswordRequest()`
- On success: navigate to `/login` with success toast

**Types:**
```ts
export interface SetNewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}
```

**Service:**
```ts
/**
 * Validates password against all required rules
 */
export function validatePasswordService(password: string): {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
} {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    isValid: hasMinLength && hasUppercase && hasNumber,
  };
}
```

---

## 2.6 — Auth Token Storage

### File: `src/lib/auth.ts`
```ts
/**
 * Stores auth token in localStorage after login
 * Note: Replace with httpOnly cookie approach for production
 */
export function setAuthTokenService(token: string): void {
  localStorage.setItem("autolead_token", token);
}

/**
 * Retrieves stored auth token
 */
export function getAuthTokenService(): string | null {
  return localStorage.getItem("autolead_token");
}

/**
 * Clears auth token on logout
 */
export function clearAuthTokenService(): void {
  localStorage.removeItem("autolead_token");
}
```

---

## 2.7 — Redirect Logic

- Unauthenticated users hitting any protected route → redirect to `/login`
- After login, redirect based on role (see `resolveLoginRedirectService`)
- Implement route protection in `layouts_navigation.md`.

---

## Checklist

- [ ] Auth layout created
- [ ] Login page — form, role toggle, validation, submit
- [ ] OtpInput component — 6 boxes, auto-focus, paste support
- [ ] Forgot Password page
- [ ] Verify OTP page — with countdown timer
- [ ] New Password page — with live validation checklist
- [ ] Auth types defined (`LoginFormData`, `LoginResponseData`, `SetNewPasswordFormData`)
- [ ] Auth requests stubbed (`loginRequest`, `sendOtpRequest`, `verifyOtpRequest`, `resetPasswordRequest`)
- [ ] Auth service functions (`resolveLoginRedirectService`, `validatePasswordService`)
- [ ] Token storage utilities in `src/lib/auth.ts`

---

**← [Setup](./project_setup.md) | [Layouts →](./layouts_navigation.md)**

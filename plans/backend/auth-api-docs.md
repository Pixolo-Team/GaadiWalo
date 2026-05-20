# Auth API Documentation

This document describes the currently implemented authentication endpoints for GaadiWalo backend integration.

Source of truth:

- `apps/backend/src/modules/auth/auth.routes.ts`
- `apps/backend/src/modules/auth/auth.controller.ts`
- `apps/backend/src/modules/auth/auth.service.ts`
- `apps/backend/src/modules/auth/auth.types.ts`

## Overview

- Base path: `/auth`
- Content-Type: `application/json`
- API style: REST
- Response envelope: standardized across all endpoints

## Standard Response Envelope

### Success

```json
{
  "data": {},
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

### Error

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Human readable message",
  "error": "Error detail string"
}
```

## Endpoint List

### 1. Login

- Method: `POST`
- Path: `/auth/login`
- Purpose: Authenticates a user with business `userId` and `password`

#### Request Body

```json
{
  "userId": "S001",
  "password": "SkorostUnited12!"
}
```

#### Request Field Rules

- `userId`: required, non-empty string
- `password`: required, non-empty string

#### Success Response

```json
{
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600,
    "user": {
      "id": "S001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  },
  "status": "success",
  "status_code": 200,
  "message": "User authenticated successfully.",
  "error": null
}
```

#### Response Data Shape

```ts
interface AuthenticatedUserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}
```

#### Status Codes

- `200`: login successful
- `400`: invalid request payload
- `401`: invalid User ID or password
- `403`: account inactive
- `500`: internal/configuration failure

#### Error Example

```json
{
  "data": null,
  "status": "error",
  "status_code": 401,
  "message": "Invalid User ID or password.",
  "error": "Invalid User ID or password."
}
```

#### Frontend Notes

- Use `data.accessToken` for authenticated backend requests.
- `refreshToken` may be `null`.
- `expiresIn` may be `null`.
- `user.role` is returned as a string.

### 2. Refresh Session

- Method: `POST`
- Path: `/auth/refresh`
- Purpose: Exchanges a refresh token for a new authenticated session

#### Request Body

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### Request Field Rules

- `refreshToken`: required, non-empty string

#### Success Response

```json
{
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 3600,
    "user": {
      "id": "S001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  },
  "status": "success",
  "status_code": 200,
  "message": "Session refreshed successfully.",
  "error": null
}
```

#### Response Data Shape

```ts
interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}
```

#### Status Codes

- `200`: refresh successful
- `400`: invalid request payload
- `401`: refresh token invalid or expired
- `403`: account inactive
- `500`: internal/configuration failure

#### Frontend Notes

- Call this endpoint when an authenticated request returns `401` due to token expiry.
- Replace both stored tokens if a new `refreshToken` is returned.
- Update the in-memory auth user from the response payload.

### 3. Forgot Password

- Method: `POST`
- Path: `/auth/forgot-password`
- Purpose: Starts the password recovery flow for a registered email

#### Request Body

```json
{
  "email": "sales@example.com"
}
```

#### Request Field Rules

- `email`: required, valid email string

#### Success Response

```json
{
  "data": {
    "email": "sales@example.com"
  },
  "status": "success",
  "status_code": 200,
  "message": "Password recovery instructions have been sent.",
  "error": null
}
```

#### Response Data Shape

```ts
interface ForgotPasswordResponseData {
  email: string;
}
```

#### Status Codes

- `200`: recovery initiated
- `400`: invalid request payload
- `403`: account inactive
- `404`: email not registered
- `429`: too many attempts
- `500`: internal/configuration failure

#### Error Example

```json
{
  "data": null,
  "status": "error",
  "status_code": 404,
  "message": "This email ID is not registered. Please use a registered email ID.",
  "error": "This email ID is not registered. Please use a registered email ID."
}
```

### 3. Verify OTP

- Method: `POST`
- Path: `/auth/verify-otp`
- Purpose: Verifies the recovery OTP and returns a backend-issued reset token

#### Request Body

```json
{
  "email": "sales@example.com",
  "otp": "123456"
}
```

#### Request Field Rules

- `email`: required, valid email string
- `otp`: required, exactly 6 numeric digits

#### Success Response

```json
{
  "data": {
    "resetToken": "backend-issued-reset-token",
    "expiresAt": "2026-05-14T12:34:56.000Z"
  },
  "status": "success",
  "status_code": 200,
  "message": "OTP verified successfully.",
  "error": null
}
```

#### Response Data Shape

```ts
interface VerifyOtpResponseData {
  resetToken: string;
  expiresAt: string;
}
```

#### Status Codes

- `200`: OTP verified
- `400`: invalid request payload
- `400`: invalid or expired OTP
- `403`: account inactive
- `404`: email not registered
- `429`: too many attempts
- `500`: internal/configuration failure

#### Error Example

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid or expired OTP.",
  "error": "Invalid or expired OTP."
}
```

#### Frontend Notes

- Store `resetToken` temporarily for the password reset step.
- `expiresAt` is an ISO datetime string.

### 4. Resend OTP

- Method: `POST`
- Path: `/auth/resend-otp`
- Purpose: Requests a fresh recovery OTP

#### Request Body

```json
{
  "email": "sales@example.com"
}
```

#### Request Field Rules

- `email`: required, valid email string

#### Success Response

```json
{
  "data": {
    "email": "sales@example.com"
  },
  "status": "success",
  "status_code": 200,
  "message": "If the account exists, a new OTP has been sent.",
  "error": null
}
```

#### Response Data Shape

```ts
interface ResendOtpResponseData {
  email: string;
}
```

#### Status Codes

- `200`: resend request accepted
- `400`: invalid request payload
- `429`: too many attempts
- `500`: internal/configuration failure

#### Frontend Notes

- This endpoint intentionally avoids revealing whether the email exists.
- Unknown or inactive emails may still receive a `200` success response.

### 5. Reset Password

- Method: `POST`
- Path: `/auth/reset-password`
- Purpose: Completes password reset using the backend-issued `resetToken`

#### Request Body

```json
{
  "resetToken": "backend-issued-reset-token",
  "newPassword": "StrongPass1"
}
```

#### Request Field Rules

- `resetToken`: required, non-empty string
- `newPassword`: required string
- `newPassword` must be at least 8 characters long
- `newPassword` must include at least 1 uppercase letter
- `newPassword` must include at least 1 number

#### Success Response

```json
{
  "data": {
    "email": "sales@example.com"
  },
  "status": "success",
  "status_code": 200,
  "message": "Password updated successfully.",
  "error": null
}
```

#### Response Data Shape

```ts
interface ResetPasswordResponseData {
  email: string;
}
```

#### Status Codes

- `200`: password updated
- `400`: invalid request payload
- `400`: weak password
- `401`: reset token invalid or expired
- `500`: internal/configuration failure

#### Error Example

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Password must be at least 8 characters long and include 1 uppercase letter and 1 number.",
  "error": "Password must be at least 8 characters long and include 1 uppercase letter and 1 number."
}
```

## Integration Flow

### Login Flow

1. Call `POST /auth/login`.
2. Read `data.accessToken` from the success response.
3. Use the token for authenticated backend requests.

### Forgot Password Flow

1. Call `POST /auth/forgot-password`.
2. Ask the user to enter the OTP received over the configured recovery channel.
3. Call `POST /auth/verify-otp`.
4. Store the returned `resetToken` temporarily.
5. Call `POST /auth/reset-password` with `resetToken` and `newPassword`.

### OTP Resend Flow

1. Call `POST /auth/resend-otp` if the original OTP expires or is not received.

## Common Error Handling Notes

- The frontend should always read:
  - `status`
  - `status_code`
  - `message`
  - `error`
- Do not rely only on the raw HTTP status when displaying user-facing messages.
- Malformed JSON request bodies return a standardized `400` response.

### Invalid JSON Example

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid request body.",
  "error": "Request body must be valid JSON."
}
```

## Suggested Frontend Types

```ts
export interface ApiResponseData<T> {
  data: T | null;
  status: "success" | "error";
  status_code: number;
  message: string;
  error: string | null;
}

export interface AuthenticatedUserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}

export interface ForgotPasswordResponseData {
  email: string;
}

export interface VerifyOtpResponseData {
  resetToken: string;
  expiresAt: string;
}

export interface ResendOtpResponseData {
  email: string;
}

export interface ResetPasswordResponseData {
  email: string;
}
```

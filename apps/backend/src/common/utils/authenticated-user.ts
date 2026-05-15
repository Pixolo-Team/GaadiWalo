// TYPES //
import type { SupabaseUserRecordData } from "../../config/supabase.js";
// CONFIG //
import {
  getAuthUserByAccessToken,
  getUserByAuthIdentifier,
  getUserByEmailIdentifier,
} from "../../config/supabase.js";
// CONSTANTS //
import {
  ADMIN_ROLE_VALUE,
  LEAD_UNAUTHORIZED_MESSAGE,
  SALES_ROLE_VALUE,
} from "../constants/lead.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../constants/http.constants.js";
// UTILS //
import { sendResponse } from "./send-response.js";
// LIBRARIES //
import type { Context } from "hono";

export interface AuthenticatedUserData {
  recordId: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

const LEAD_ALLOWED_ROLE_VALUES = new Set<string>([
  SALES_ROLE_VALUE,
  ADMIN_ROLE_VALUE,
]);

const getBearerToken = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token.trim();
};

const mapAuthenticatedUser = (
  userRecord: SupabaseUserRecordData,
): AuthenticatedUserData | null => {
  const recordId = typeof userRecord.id === "string" ? userRecord.id : null;
  const fallbackUserIdentifier =
    typeof userRecord.auth_id === "string" && userRecord.auth_id.length > 0
      ? userRecord.auth_id
      : userRecord.email;
  const userId =
    typeof userRecord.user_id === "string" && userRecord.user_id.length > 0
      ? userRecord.user_id
      : fallbackUserIdentifier;
  const fullName =
    typeof userRecord.full_name === "string" && userRecord.full_name.length > 0
      ? userRecord.full_name
      : userRecord.email;
  const role = typeof userRecord.role === "string" ? userRecord.role : null;

  if (!recordId || !userId || !fullName || !role) {
    return null;
  }

  return {
    recordId,
    userId,
    email: userRecord.email,
    fullName,
    role: role.toLowerCase(),
  };
};

/**
 * Resolves the authenticated User from the request Bearer token and enforces Lead API role access.
 */
export const requireAuthenticatedSalesUser = async (
  context: Context,
): Promise<{
  authenticatedUser: AuthenticatedUserData | null;
  errorResponse: Response | null;
}> => {
  try {
    const accessToken = getBearerToken(context.req.header("Authorization"));

    if (!accessToken) {
      return {
        authenticatedUser: null,
        errorResponse: sendResponse({
          context,
          statusCode: HTTP_STATUS_CODES.unauthorized,
          status: "error",
          message: LEAD_UNAUTHORIZED_MESSAGE,
          error: LEAD_UNAUTHORIZED_MESSAGE,
        }),
      };
    }

    const authUser = await getAuthUserByAccessToken(accessToken);
    const userRecord =
      (await getUserByAuthIdentifier(authUser.id)) ??
      (await getUserByEmailIdentifier(authUser.email));

    if (!userRecord) {
      return {
        authenticatedUser: null,
        errorResponse: sendResponse({
          context,
          statusCode: HTTP_STATUS_CODES.unauthorized,
          status: "error",
          message: LEAD_UNAUTHORIZED_MESSAGE,
          error: LEAD_UNAUTHORIZED_MESSAGE,
        }),
      };
    }

    const authenticatedUser = mapAuthenticatedUser(userRecord);

    if (
      !authenticatedUser ||
      !LEAD_ALLOWED_ROLE_VALUES.has(authenticatedUser.role)
    ) {
      return {
        authenticatedUser: null,
        errorResponse: sendResponse({
          context,
          statusCode: HTTP_STATUS_CODES.forbidden,
          status: "error",
          message: LEAD_UNAUTHORIZED_MESSAGE,
          error: LEAD_UNAUTHORIZED_MESSAGE,
        }),
      };
    }

    return {
      authenticatedUser,
      errorResponse: null,
    };
  } catch {
    return {
      authenticatedUser: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.internalServerError,
        status: "error",
        message: INTERNAL_SERVER_ERROR_MESSAGE,
        error: INTERNAL_SERVER_ERROR_MESSAGE,
      }),
    };
  }
};

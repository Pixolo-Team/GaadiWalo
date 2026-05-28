// LIBRARIES //
import type { ZodError, ZodIssue } from "zod";

const formatIssuePath = (issue: ZodIssue): string => {
  if (issue.path.length === 0) {
    return "request";
  }

  return issue.path.join(".");
};

const formatIssueMessage = (issue: ZodIssue): string => {
  const issuePath = formatIssuePath(issue);

  if (issue.code === "invalid_type" && issue.received === "nan") {
    return `${issuePath} must be a valid number.`;
  }

  return `${issuePath}: ${issue.message}`;
};

/**
 * Formats Zod validation issues into a readable API error message.
 */
export const formatZodError = (error: ZodError): string => {
  return error.issues.map(formatIssueMessage).join(" ");
};

// LIBRARIES //
import crypto from "node:crypto";

interface RecoveryTokenPayloadData {
  email: string;
  recoveryAccessToken: string;
  exp: number;
}

export interface IssuedRecoveryTokenData {
  resetToken: string;
  expiresAt: string;
}

const encodeTokenSection = (value: string): string => {
  return Buffer.from(value, "utf8").toString("base64url");
};

const decodeTokenSection = (value: string): string => {
  return Buffer.from(value, "base64url").toString("utf8");
};

const signTokenPayload = (payload: string, secret: string): string => {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
};

/**
 * Issues a signed reset token for the verified recovery context.
 */
export const issueRecoveryToken = ({
  email,
  recoveryAccessToken,
  secret,
  ttlMinutes,
}: {
  email: string;
  recoveryAccessToken: string;
  secret: string;
  ttlMinutes: number;
}): IssuedRecoveryTokenData => {
  const expiresAtMs = Date.now() + ttlMinutes * 60 * 1000;
  const payload: RecoveryTokenPayloadData = {
    email,
    recoveryAccessToken,
    exp: expiresAtMs,
  };
  const encodedPayload = encodeTokenSection(JSON.stringify(payload));
  const encodedSignature = signTokenPayload(encodedPayload, secret);

  return {
    resetToken: `${encodedPayload}.${encodedSignature}`,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
};

/**
 * Verifies and decodes a previously issued reset token.
 */
export const verifyRecoveryToken = ({
  resetToken,
  secret,
}: {
  resetToken: string;
  secret: string;
}): RecoveryTokenPayloadData | null => {
  const tokenSegments = resetToken.split(".");

  if (tokenSegments.length !== 2) {
    return null;
  }

  const encodedPayload = tokenSegments[0];
  const encodedSignature = tokenSegments[1];

  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  const expectedSignature = signTokenPayload(encodedPayload, secret);

  if (encodedSignature.length !== expectedSignature.length) {
    return null;
  }

  const signatureMatches = crypto.timingSafeEqual(
    Buffer.from(encodedSignature),
    Buffer.from(expectedSignature),
  );

  if (!signatureMatches) {
    return null;
  }

  const parsedPayload = JSON.parse(
    decodeTokenSection(encodedPayload),
  ) as RecoveryTokenPayloadData;

  if (Date.now() > parsedPayload.exp) {
    return null;
  }

  return parsedPayload;
};

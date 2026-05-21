import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Minimal root route fallback; middleware remains primary redirect layer.
 */
export default async function RootPage() {
  const hasAccessToken = Boolean((await cookies()).get("access_token")?.value);
  redirect(hasAccessToken ? "/leads" : "/login");
}


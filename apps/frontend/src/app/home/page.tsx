import { redirect } from "next/navigation";

/**
 * Redirects legacy /home path to the canonical sales home route.
 */
export default function HomeRedirectPage() {
  redirect("/");
}

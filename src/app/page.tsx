import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { localeFromAcceptLanguage } from "@/lib/i18n/config";

export default async function RootPage() {
  const requestHeaders = await headers();
  redirect(`/${localeFromAcceptLanguage(requestHeaders.get("accept-language"))}`);
}

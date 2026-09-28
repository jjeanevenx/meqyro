import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, localeFromAcceptLanguage } from "@/lib/i18n/config";

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("meqyro_locale")?.value;
  if (savedLocale && isLocale(savedLocale)) {
    redirect(`/${savedLocale}`);
  }

  const requestHeaders = await headers();
  redirect(`/${localeFromAcceptLanguage(requestHeaders.get("accept-language"))}`);
}

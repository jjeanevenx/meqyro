import TermsOfServicePage from "../legal/terms/page";
import { locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default TermsOfServicePage;

import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";
import { createLegacyMetadata } from "@/lib/metadata";

export const metadata: Metadata = createLegacyMetadata("/about/");

export default function LegacyAboutPage() {
  return <LocaleRedirect path="/about/" />;
}

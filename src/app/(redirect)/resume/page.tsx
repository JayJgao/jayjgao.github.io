import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";
import { createLegacyMetadata } from "@/lib/metadata";

export const metadata: Metadata = createLegacyMetadata("/resume/");

export default function LegacyResumePage() {
  return <LocaleRedirect path="/resume/" />;
}

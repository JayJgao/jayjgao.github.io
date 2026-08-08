import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";
import { createLegacyMetadata } from "@/lib/metadata";

export const metadata: Metadata = createLegacyMetadata("/projects/");

export default function LegacyProjectsPage() {
  return <LocaleRedirect path="/projects/" />;
}

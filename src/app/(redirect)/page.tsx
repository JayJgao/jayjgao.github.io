import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";
import { getMessages } from "@/lib/i18n";
import { createHomeDescription, createLocalizedMetadata } from "@/lib/metadata";

const copy = getMessages("ko").home.hero;

export const metadata: Metadata = {
  ...createLocalizedMetadata({
    locale: "ko",
    path: "/",
    title: `${copy.name} | AI Product Leader`,
    description: createHomeDescription("ko", copy),
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootRedirectPage() {
  return <LocaleRedirect path="/" />;
}

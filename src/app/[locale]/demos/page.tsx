import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemosExplorer } from "@/components/demos/DemosExplorer";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = getMessages(locale).demos.page;
  return createLocalizedMetadata({
    locale,
    path: "/demos/",
    title: `${copy.title} | Jay Ko`,
    description: copy.description,
  });
}

export default async function DemosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="page-container py-8 md:py-12">
      <DemosExplorer locale={locale} />
    </main>
  );
}

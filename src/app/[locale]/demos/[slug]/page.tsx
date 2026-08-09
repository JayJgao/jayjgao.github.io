import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoDetail } from "@/components/demos/DemoDetail";
import { getAllDemoSlugs, getDemoBySlug } from "@/lib/demos";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDemoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const demo = getDemoBySlug(slug);
  if (!demo) notFound();

  return createLocalizedMetadata({
    locale,
    path: `/demos/${slug}/`,
    title: `${demo.name} | Jay Ko`,
    description: demo.summary[locale],
  });
}

export default async function DemoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const demo = getDemoBySlug(slug);
  if (!demo) notFound();

  return (
    <main id="main-content">
      <DemoDetail demo={demo} locale={locale} />
    </main>
  );
}

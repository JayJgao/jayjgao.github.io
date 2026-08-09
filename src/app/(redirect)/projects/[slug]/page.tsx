import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/i18n/LocaleRedirect";
import { createLegacyMetadata } from "@/lib/metadata";
import { getCanonicalProjectPath, getLegacyProjectSlugs } from "@/lib/project-redirects";
import { getAllProjectSlugs } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set([...getAllProjectSlugs(), ...getLegacyProjectSlugs()])].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return createLegacyMetadata(getCanonicalProjectPath(slug));
}

export default async function LegacyProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LocaleRedirect path={getCanonicalProjectPath(slug)} />;
}

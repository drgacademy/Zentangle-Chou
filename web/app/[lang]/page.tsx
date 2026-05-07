import { getDict, isLang, type Lang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import HomeContent from "@/components/home/HomeContent";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);
  return <HomeContent lang={lang as Lang} dict={dict} />;
}

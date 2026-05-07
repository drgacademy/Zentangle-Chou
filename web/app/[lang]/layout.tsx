import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import InkPageTransition from "@/components/atmosphere/InkPageTransition";
import HtmlLang from "@/components/layout/HtmlLang";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDict(lang as Lang);

  return (
    <>
      <HtmlLang lang={lang as Lang} />
      <SiteHeader lang={lang as Lang} dict={dict} />
      <InkPageTransition>{children}</InkPageTransition>
      <SiteFooter lang={lang as Lang} dict={dict} />
    </>
  );
}

import SceneHeroTile from "./SceneHeroTile";
import SceneManifesto from "./SceneManifesto";
import SceneEightBreaths from "./SceneEightBreaths";
import ScenePatternIndex from "./ScenePatternIndex";
import SceneFooterMark from "./SceneFooterMark";
import type { Dict, Lang } from "@/lib/i18n";

export default function HomeContent({ lang, dict }: { lang: Lang; dict: Dict }) {
  return (
    <>
      <SceneHeroTile dict={dict} lang={lang} />
      <SceneManifesto dict={dict} lang={lang} />
      <SceneEightBreaths dict={dict} />
      <ScenePatternIndex dict={dict} lang={lang} />
      <SceneFooterMark dict={dict} />
    </>
  );
}

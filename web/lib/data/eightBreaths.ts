export type BreathStep = {
  index: number;
  i18nKey: string;
  layerHint:
    | "gratitude"
    | "dot"
    | "pencil-border"
    | "pencil-string"
    | "ink"
    | "shade"
    | "initial"
    | "appreciate";
};

export const eightBreaths: BreathStep[] = [
  { index: 1, i18nKey: "eightBreaths.step1", layerHint: "gratitude" },
  { index: 2, i18nKey: "eightBreaths.step2", layerHint: "dot" },
  { index: 3, i18nKey: "eightBreaths.step3", layerHint: "pencil-border" },
  { index: 4, i18nKey: "eightBreaths.step4", layerHint: "pencil-string" },
  { index: 5, i18nKey: "eightBreaths.step5", layerHint: "ink" },
  { index: 6, i18nKey: "eightBreaths.step6", layerHint: "shade" },
  { index: 7, i18nKey: "eightBreaths.step7", layerHint: "initial" },
  { index: 8, i18nKey: "eightBreaths.step8", layerHint: "appreciate" },
];

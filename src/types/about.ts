export type AboutNarrative = {
  title: string;
  opening: { quote: string; body: string[] };
  markets: {
    kicker: string;
    intro: string;
    items: Array<{ language: string; detail: string }>;
  };
  motivation: { body: string[]; belief: string };
  workingWithMe: {
    kicker: string;
    lead: string;
    principles: string[];
  };
};

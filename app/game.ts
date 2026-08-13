export type Card = {
  id: number;
  value: number;
};

export type PairResult = {
  isMatch: boolean;
  lives: number;
  matches: number;
  status: "playing" | "won" | "lost";
};

export function createDeck(random: () => number = Math.random): Card[] {
  const cards = Array.from({ length: 10 }, (_, index) => index + 1)
    .flatMap((value) => [value, value])
    .map((value, id) => ({ id, value }));

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [cards[index], cards[target]] = [cards[target], cards[index]];
  }

  return cards;
}

export function resolvePair(
  firstCard: Card,
  secondCard: Card,
  lives: number,
  matches: number,
): PairResult {
  if (firstCard.value === secondCard.value) {
    const nextMatches = matches + 1;
    return {
      isMatch: true,
      lives,
      matches: nextMatches,
      status: nextMatches === 10 ? "won" : "playing",
    };
  }

  const nextLives = Math.max(0, lives - 1);
  return {
    isMatch: false,
    lives: nextLives,
    matches,
    status: nextLives === 0 ? "lost" : "playing",
  };
}

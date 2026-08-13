import assert from "node:assert/strict";
import test from "node:test";
import { createDeck, resolvePair } from "../app/game";

test("creates 20 cards with exactly two cards for every number from 1 to 10", () => {
  const deck = createDeck(() => 0.42);
  const counts = new Map<number, number>();

  for (const card of deck) {
    counts.set(card.value, (counts.get(card.value) ?? 0) + 1);
  }

  assert.equal(deck.length, 20);
  assert.equal(new Set(deck.map((card) => card.id)).size, 20);
  assert.deepEqual([...counts.keys()].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual([...counts.values()], Array(10).fill(2));
});

test("a matching pair increases Match without reducing Live", () => {
  const result = resolvePair({ id: 0, value: 4 }, { id: 1, value: 4 }, 7, 3);

  assert.deepEqual(result, {
    isMatch: true,
    lives: 7,
    matches: 4,
    status: "playing",
  });
});

test("the tenth matching pair wins the game", () => {
  const result = resolvePair({ id: 0, value: 8 }, { id: 1, value: 8 }, 2, 9);
  assert.equal(result.matches, 10);
  assert.equal(result.status, "won");
});

test("an unmatched pair reduces Live by one and zero lives loses the game", () => {
  const continuing = resolvePair({ id: 0, value: 2 }, { id: 1, value: 7 }, 10, 0);
  const lost = resolvePair({ id: 0, value: 2 }, { id: 1, value: 7 }, 1, 6);

  assert.deepEqual(continuing, {
    isMatch: false,
    lives: 9,
    matches: 0,
    status: "playing",
  });
  assert.equal(lost.lives, 0);
  assert.equal(lost.matches, 6);
  assert.equal(lost.status, "lost");
});

"use client";

import { useEffect, useState } from "react";
import { createDeck, resolvePair } from "./game";
import type { Card } from "./game";

type GameStatus = "playing" | "won" | "lost";

const INITIAL_LIVES = 10;
const PAIRS_TO_WIN = 10;

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() => createDeck());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [pendingMismatch, setPendingMismatch] = useState(false);
  const [matches, setMatches] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [status, setStatus] = useState<GameStatus>("playing");

  const resetGame = () => {
    setCards(createDeck());
    setSelectedIds([]);
    setMatchedIds([]);
    setPendingMismatch(false);
    setMatches(0);
    setLives(INITIAL_LIVES);
    setStatus("playing");
  };

  useEffect(() => {
    if (!pendingMismatch || status !== "playing") {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest("[data-memory-card]")) {
        setSelectedIds([]);
        setPendingMismatch(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [pendingMismatch, status]);

  const chooseCard = (card: Card) => {
    if (status !== "playing" || matchedIds.includes(card.id)) {
      return;
    }

    if (pendingMismatch) {
      if (selectedIds.includes(card.id)) {
        return;
      }

      setSelectedIds([card.id]);
      setPendingMismatch(false);
      return;
    }

    if (selectedIds.includes(card.id)) {
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([card.id]);
      return;
    }

    const firstCard = cards.find((item) => item.id === selectedIds[0]);
    const nextSelection = [selectedIds[0], card.id];
    setSelectedIds(nextSelection);

    if (!firstCard) {
      return;
    }

    const result = resolvePair(firstCard, card, lives, matches);

    if (result.isMatch) {
      setMatchedIds((current) => [...current, ...nextSelection]);
      setSelectedIds([]);
      setMatches(result.matches);

      if (result.status === "won") {
        setStatus("won");
      }
      return;
    }

    setLives(result.lives);
    setPendingMismatch(true);

    if (result.status === "lost") {
      setStatus("lost");
    }
  };

  const statusMessage =
    status === "won"
      ? "You matched every pair!"
      : status === "lost"
        ? "You ran out of lives."
        : pendingMismatch
          ? "No match. Choose another card to continue."
          : selectedIds.length === 1
            ? "Now find its matching number."
            : "Find all 10 matching pairs.";

  return (
    <main className="game-page">
      <section className="game-shell" aria-labelledby="game-title">
        <header className="game-header">
          <div>
            <p className="eyebrow">NUMBER PAIRS</p>
            <h1 id="game-title">Memory Matching</h1>
            <p className="instructions">Flip two cards. Remember the numbers. Match them all.</p>
          </div>
          <button className="reset-button" type="button" onClick={resetGame}>
            New game
          </button>
        </header>

        <div className="scoreboard" aria-label="Game score">
          <div className="score-item">
            <span className="score-label">Match</span>
            <strong>{matches}<small> / {PAIRS_TO_WIN}</small></strong>
          </div>
          <div className="score-divider" aria-hidden="true" />
          <div className="score-item">
            <span className="score-label">Live</span>
            <strong className={lives <= 3 ? "danger" : ""}>{lives}</strong>
          </div>
          <p className="status-message" aria-live="polite">{statusMessage}</p>
        </div>

        <div className="board" aria-label="Memory card board">
          {cards.map((card, index) => {
            const isSelected = selectedIds.includes(card.id);
            const isMatched = matchedIds.includes(card.id);
            const isVisible = isSelected || isMatched;

            return (
              <button
                aria-label={
                  isMatched
                    ? `Matched card ${card.value}`
                    : isVisible
                      ? `Card ${card.value}`
                      : `Hidden card ${index + 1}`
                }
                className={`memory-card${isVisible ? " is-visible" : ""}${isMatched ? " is-matched" : ""}`}
                data-memory-card
                disabled={status !== "playing" || isMatched}
                key={card.id}
                onClick={(event) => {
                  event.stopPropagation();
                  chooseCard(card);
                }}
                type="button"
              >
                <span className="card-inner">
                  <span className="card-face card-back" aria-hidden="true">
                    <span className="card-mark">?</span>
                  </span>
                  <span className="card-face card-front" aria-hidden={!isVisible}>
                    <span>{card.value}</span>
                    {isMatched && <span className="match-mark" aria-hidden="true">✓</span>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {status !== "playing" && (
          <div className={`result-panel ${status}`} role="status">
            <div>
              <p>{status === "won" ? "BOARD CLEARED" : "GAME OVER"}</p>
              <h2>{status === "won" ? "Excellent memory!" : "Almost there!"}</h2>
              <span>
                {status === "won"
                  ? `You found all ${PAIRS_TO_WIN} pairs with ${lives} lives left.`
                  : `You found ${matches} of ${PAIRS_TO_WIN} pairs.`}
              </span>
            </div>
            <button type="button" onClick={resetGame}>Play again</button>
          </div>
        )}

        <footer className="game-footer">
          <span><i className="legend-card selected" /> Selected</span>
          <span><i className="legend-card matched" /> Matched</span>
          <span className="tip">A wrong pair costs one life.</span>
        </footer>
      </section>
    </main>
  );
}

"use client";

import {Button} from "@/components/ui/button";
import {MatchingPair} from "@/lib/schemas";
import {shuffleArray} from "@/utils/helpers";
import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState} from "react";

interface MatchingGameProps {
  title: string;
  questions: MatchingPair[];
  clearPDF: () => void;
}

type MatchCard = {id: string; text: string; matched: boolean};

export default function MatchingGame({
  title,
  questions,
  clearPDF,
}: MatchingGameProps) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<MatchCard[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // Load best time from localStorage when the component mounts
  useEffect(() => {
    const storedBestTime = localStorage.getItem("bestTime");
    if (storedBestTime) {
      setBestTime(parseFloat(storedBestTime));
    }
  }, []);

  // Initialize and shuffle cards when a new game starts
  const startGame = () => {
    if (!questions.length) return;

    const shuffledCards = shuffleArray([
      ...questions.map((pair) => ({
        id: `${pair.term}-term`,
        text: pair.term,
        matched: false,
      })),
      ...questions.map((pair) => ({
        id: `${pair.term}-match`,
        text: pair.match,
        matched: false,
      })),
    ]);

    setCards(shuffledCards);
    setSelected([]);
    setStartTime(Date.now());
    setTimeElapsed(null);
    setIsNewBestTime(false);
  };

  useEffect(() => {
    startGame();
  }, [questions]);

  const handleCardClick = (card: MatchCard) => {
    if (
      selected.length === 2 ||
      card.matched ||
      selected.some((c) => c.id === card.id)
    )
      return;

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const isMatch = first.id.split("-")[0] === second.id.split("-")[0];

      setTimeout(() => {
        if (isMatch) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? {...c, matched: true}
                : c,
            ),
          );
        }
        setSelected([]);
      }, 500);
    }
  };

  // Check if the game is completed and track time
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched) && startTime) {
      const elapsed = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
      setTimeElapsed(elapsed);

      // Check if it's a new best time
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
        localStorage.setItem("bestTime", elapsed.toString());
        setIsNewBestTime(true);
      }
    }
  }, [cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">
        {timeElapsed
          ? isNewBestTime
            ? `🎉 New Best Time: ${timeElapsed} seconds!`
            : `Game Completed in ${timeElapsed} seconds!`
          : title}
      </h2>

      {bestTime !== null && (
        <p className="text-lg mb-4 text-blue-500">
          🏆 Best Time: {bestTime} seconds
        </p>
      )}

      <div className="flex gap-4 mb-6">
        <Button onClick={startGame}>Restart</Button>
        <Button onClick={clearPDF}>Play Again</Button>
      </div>

      <div className="grid grid-cols-4 grid-rows-3 gap-6">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{opacity: 1}}
              animate={{
                opacity: card.matched ? 0 : 1,
                scale: card.matched ? 0.9 : 1,
              }}
              exit={{opacity: 0, scale: 0.8}}
              transition={{duration: 0.4}}
              className={`p-6 w-48 h-48 flex items-center justify-center rounded-lg text-white font-semibold text-center cursor-pointer text-lg
                ${
                  selected.some((c) => c.id === card.id)
                    ? "bg-green-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
              onClick={() => handleCardClick(card)}
            >
              {card.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

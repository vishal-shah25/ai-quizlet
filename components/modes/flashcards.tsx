"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {motion, AnimatePresence} from "framer-motion";
import {ChevronLeft, ChevronRight, RotateCcw} from "lucide-react";
import {Flashcard} from "@/lib/schemas";

interface FlashcardsProps {
  title: string;
  questions: Flashcard[];
  clearPDF: () => void;
}

export default function Flashcards({
  title,
  questions,
  clearPDF,
}: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === " ") setIsFlipped((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-card border border-border shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>

        <div
          className="relative w-full h-64 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-300 shadow-md"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="term"
                initial={{rotateY: -90, opacity: 0}}
                animate={{rotateY: 0, opacity: 1}}
                exit={{rotateY: 90, opacity: 0}}
                transition={{duration: 0.4}}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-blue-500 text-black rounded-lg"
              >
                <span className="text-lg font-semibold opacity-90">
                  {currentCard.category || "General"}
                </span>
                <span className="text-2xl font-bold">{currentCard.term}</span>
              </motion.div>
            ) : (
              <motion.div
                key="definition"
                initial={{rotateY: 90, opacity: 0}}
                animate={{rotateY: 0, opacity: 1}}
                exit={{rotateY: -90, opacity: 0}}
                transition={{duration: 0.4}}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-green-600 text-white rounded-lg"
              >
                <span className="text-xl font-medium">
                  {currentCard.definition}
                </span>
                {currentCard.example && (
                  <p className="mt-3 text-sm italic opacity-80">
                    Example: {currentCard.example}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="ghost"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium opacity-80">
            {currentIndex + 1} / {questions.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            variant="ghost"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="w-full bg-muted hover:bg-muted/80"
            onClick={clearPDF}
          >
            <RotateCcw className="h-5 w-5 mr-2" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}

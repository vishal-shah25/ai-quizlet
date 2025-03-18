"use client";

import Header from "@/components/header";
import MainForm from "@/components/main-form";
import Flashcards from "@/components/modes/flashcards";
import MatchingGame from "@/components/modes/matching-game";
import Quiz from "@/components/modes/quiz";
import {Flashcard, MatchingPair, Question} from "@/lib/schemas";
import {ModeType} from "@/utils/types";
import {useState} from "react";

export default function Home() {
  const [mode, setMode] = useState<ModeType>("quiz");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);
  const [title, setTitle] = useState<string>();

  const clearPDF = () => {
    setQuizQuestions([]);
    setFlashcards([]);
    setMatchingPairs([]);
  };

  return (
    <>
      <Header />
      {mode === "quiz" && quizQuestions.length >= 4 ? (
        <Quiz
          title={title ?? "Quiz"}
          questions={quizQuestions}
          clearPDF={clearPDF}
        />
      ) : mode === "flashcards" && flashcards.length >= 4 ? (
        <Flashcards
          title={title ?? "Flashcards"}
          questions={flashcards}
          clearPDF={clearPDF}
        />
      ) : mode === "matching" && matchingPairs.length >= 4 ? (
        <MatchingGame
          title={title ?? "Matching Game"}
          questions={matchingPairs}
          clearPDF={clearPDF}
        />
      ) : (
        <MainForm
          setQuizQuestions={setQuizQuestions}
          setFlashcards={setFlashcards}
          setMatchingPairs={setMatchingPairs}
          setTitle={setTitle}
          setMode={setMode}
          mode={mode}
        />
      )}
    </>
  );
}

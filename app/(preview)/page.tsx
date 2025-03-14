"use client";

import {useState} from "react";
import Quiz from "@/components/quiz";
import Flashcards from "@/components/flashcards";
import {Question, Flashcard} from "@/lib/schemas";
import MainForm from "@/components/main-form";

export default function Home() {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [title, setTitle] = useState<string>();

  const clearPDF = () => {
    setQuizQuestions([]);
    setFlashcards([]);
  };

  if (quizQuestions.length >= 4) {
    return (
      <Quiz
        title={title ?? "Quiz"}
        questions={quizQuestions}
        clearPDF={clearPDF}
      />
    );
  } else if (flashcards.length >= 4) {
    return (
      <Flashcards
        title={title ?? "Flashcards"}
        questions={flashcards}
        clearPDF={clearPDF}
      />
    );
  }

  return (
    <MainForm
      setQuizQuestions={setQuizQuestions}
      setFlashcards={setFlashcards}
      setTitle={setTitle}
    />
  );
}

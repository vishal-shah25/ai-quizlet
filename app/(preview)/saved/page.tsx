"use client";

import {Flashcard, MatchingPair, Question} from "@/lib/schemas";
import {useEffect, useState} from "react";

export default function SavedQuizzes() {
  const [savedQuizzes, setSavedQuizzes] = useState<Question[]>([]);
  const [savedFlashcards, setSavedFlashcards] = useState<Flashcard[]>([]);
  const [savedMatchingGames, setSavedMatchingGames] = useState<MatchingPair[]>(
    [],
  );

  useEffect(() => {
    setSavedQuizzes(JSON.parse(localStorage.getItem("savedQuizzes") || "[]"));
    setSavedFlashcards(
      JSON.parse(localStorage.getItem("savedFlashcards") || "[]"),
    );
    setSavedMatchingGames(
      JSON.parse(localStorage.getItem("savedMatchingGames") || "[]"),
    );
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Saved Quizzes</h2>
      {savedQuizzes.length > 0 ? (
        savedQuizzes.map((quiz, index) => (
          <div key={index} className="border p-4 my-2">
            <h3 className="text-lg font-semibold">{quiz.question}</h3>
          </div>
        ))
      ) : (
        <p>No quizzes saved yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-6">Saved Flashcards</h2>
      {savedFlashcards.length > 0 ? (
        savedFlashcards.map((flashcard, index) => (
          <div key={index} className="border p-4 my-2">
            <h3 className="text-lg font-semibold">{flashcard.term}</h3>
            <p>{flashcard.definition}</p>
          </div>
        ))
      ) : (
        <p>No flashcards saved yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-6">Saved Matching Games</h2>
      {savedMatchingGames.length > 0 ? (
        savedMatchingGames.map((pair, index) => (
          <div key={index} className="border p-4 my-2">
            <h3 className="text-lg font-semibold">
              {pair.term} - {pair.match}
            </h3>
          </div>
        ))
      ) : (
        <p>No matching games saved yet.</p>
      )}
    </div>
  );
}

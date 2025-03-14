"use server";

import {flashcardsSchema} from "@/lib/schemas";
import {google} from "@ai-sdk/google";
import {generateObject} from "ai";
import {z} from "zod";

export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " +
      file,
  });

  return result.object.title;
};

export const generateFlashcardTitle = async (file: string) => {
  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three-word title for the flashcard set based on the file name provided.",
        ),
    }),
    prompt: `
      Generate a concise, relevant title for a **flashcard set** based on the provided file name.
      - The title should be **at most three words**.
      - Extract meaningful information from the file name if possible.
      - If the file name is unclear, default to **'Flashcards'**.

      **File Name:** ${file}
    `,
  });

  return result.object.title;
};

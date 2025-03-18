"use server";

import {ModeType} from "@/utils/types";
import {google} from "@ai-sdk/google";
import {generateObject} from "ai";
import {z} from "zod";

export const generateTitle = async (file: string, mode: ModeType) => {
  const modePromptMap: Record<ModeType, string> = {
    quiz: "Generate a concise title for a **quiz** based on the file name provided.",
    flashcards:
      "Generate a concise title for a **flashcard set** based on the file name provided.",
    matching:
      "Generate a concise title for a **matching game** based on the file name provided.",
  };

  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three-word title for the generated content based on the file name provided.",
        ),
    }),
    prompt: `
      ${modePromptMap[mode]}
      - The title should be **at most three words**.
      - Extract meaningful information from the file name if possible.
      - If the file name is unclear, default to **'${
        mode[0].toUpperCase() + mode.slice(1)
      }'**.

      **File Name:** ${file}
    `,
  });

  return result.object.title;
};

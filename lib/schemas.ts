import {z} from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on.",
    ),
});

export const flashcardSchema = z.object({
  term: z
    .string()
    .describe(
      "The key concept, term, or question on the front of the flashcard.",
    ),
  definition: z
    .string()
    .describe("The explanation or answer on the back of the flashcard."),
  example: z
    .string()
    .optional()
    .describe("An optional example to illustrate the concept."),
  category: z
    .string()
    .optional()
    .describe("An optional category, such as 'Biology' or 'Math'."),
});

export const matchingPairSchema = z.object({
  term: z.string().describe("A key concept or term to be matched."),
  match: z.string().describe("The corresponding correct match for the term."),
});

export type Question = z.infer<typeof questionSchema>;
export type Flashcard = z.infer<typeof flashcardSchema>;
export type MatchingPair = z.infer<typeof matchingPairSchema>;

export const questionsSchema = z.array(questionSchema).min(4).max(12);
export const flashcardsSchema = z.array(flashcardSchema).min(4).max(20);
export const matchingGameSchema = z.array(matchingPairSchema).length(6);

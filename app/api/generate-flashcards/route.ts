import {flashcardSchema, questionSchema, questionsSchema} from "@/lib/schemas";
import {google} from "@ai-sdk/google";
import {streamObject} from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {files} = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: `
            You are an AI assistant that extracts key concepts from documents.
            Your task is to create high-quality flashcards with:
            - A **term** (key concept)
            - A **concise definition**
            - An **optional example**
            - An **optional category**
            Generate at least 4 flashcards.
          `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract key concepts and generate flashcards from this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: flashcardSchema,
    output: "array",
    onFinish: ({object}) => {
      const res = flashcardSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}

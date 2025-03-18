import {matchingPairSchema} from "@/lib/schemas";
import {google} from "@ai-sdk/google";
import {streamObject} from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {files} = await req.json();
  const firstFile = files[0]?.data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: `
            You are an AI assistant that extracts key concepts from documents.
            Your task is to create **matching game pairs** with:
            - A **term** (key concept)
            - A **corresponding correct match** (definition or related concept) which should be less than 6 words.
            Generate 6 pairs.
          `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract key concepts and generate matching game pairs from this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: matchingPairSchema,
    output: "array",
    onFinish: ({object}) => {
      const res = matchingPairSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}

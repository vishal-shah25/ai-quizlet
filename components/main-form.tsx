"use client";

import {generateQuizTitle} from "@/app/(preview)/actions";
import LoadingProgress from "@/components/loading-progress";
import ModeSelector from "@/components/mode-selector";
import PdfUpload from "@/components/pdf-upload";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Flashcard,
  flashcardsSchema,
  Question,
  questionsSchema,
} from "@/lib/schemas";
import {encodeFileAsBase64} from "@/lib/utils";
import {experimental_useObject} from "ai/react";
import {Loader2} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {z} from "zod";

export default function MainForm({
  setQuizQuestions,
  setFlashcards,
  setTitle,
}: {
  setQuizQuestions: (questions: Question[]) => void;
  setFlashcards: (flashcards: Flashcard[]) => void;
  setTitle: (title: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"flashcards" | "quiz">("quiz");

  const {submit, object, isLoading} = experimental_useObject({
    api: mode === "quiz" ? "/api/generate-quiz" : "/api/generate-flashcards",
    schema: (mode === "quiz" ? questionsSchema : flashcardsSchema) as z.ZodType<
      Question[] | Flashcard[]
    >,
    initialValue: undefined,
    onError: () => {
      toast.error(`Failed to generate ${mode}. Please try again.`);
      setFiles([]);
    },
    onFinish: ({object}) => {
      if (mode === "quiz") {
        setQuizQuestions(object as Question[]);
      } else {
        setFlashcards(object as Flashcard[]);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );

    setTitle(await generateQuizTitle(encodedFiles[0].name));
    submit({files: encodedFiles});
  };

  const progress = object ? (object.length / 4) * 100 : 0;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeSelector mode={mode} setMode={setMode} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <PdfUpload files={files} setFiles={setFiles} />
            <Button
              type="submit"
              className="w-full"
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Generate ${mode}`
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <LoadingProgress
            progress={progress}
            isLoading={isLoading}
            partialCount={object?.length}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

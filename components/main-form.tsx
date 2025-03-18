"use client";

import {generateTitle} from "@/app/(preview)/actions";
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
  matchingGameSchema,
  MatchingPair,
  Question,
  questionsSchema,
} from "@/lib/schemas";
import {encodeFileAsBase64} from "@/lib/utils";
import {AVAILABLE_MODES} from "@/utils/constants";
import {capitalizeString, saveToLocalStorage} from "@/utils/helpers";
import {ModeType} from "@/utils/types";
import {experimental_useObject} from "ai/react";
import {Loader2} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {z} from "zod";

export default function MainForm({
  setQuizQuestions,
  setFlashcards,
  setMatchingPairs,
  setTitle,
  mode,
  setMode,
}: {
  setQuizQuestions: (questions: Question[]) => void;
  setFlashcards: (flashcards: Flashcard[]) => void;
  setMatchingPairs: (matchingPairs: MatchingPair[]) => void;
  setTitle: (title: string) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const modeConfig = {
    quiz: {
      api: "/api/generate-quiz",
      schema: questionsSchema,
    },
    flashcards: {
      api: "/api/generate-flashcards",
      schema: flashcardsSchema,
    },
    matching: {
      api: "/api/generate-matching-pairs",
      schema: matchingGameSchema,
    },
  };

  const {submit, object, isLoading} = experimental_useObject({
    api: modeConfig[mode].api,
    schema: modeConfig[mode].schema as z.ZodType<
      Question[] | Flashcard[] | MatchingPair[]
    >,
    initialValue: undefined,
    onError: () => {
      toast.error(
        `Failed to generate ${capitalizeString(mode)}. Please try again.`,
      );
      setFiles([]);
    },
    onFinish: ({object}) => {
      if (!object) return;
      if (mode === AVAILABLE_MODES.QUIZ) {
        setQuizQuestions(object as Question[]);
        saveToLocalStorage("savedQuizzes", object);
      } else if (mode === AVAILABLE_MODES.FLASHCARDS) {
        setFlashcards(object as Flashcard[]);
        saveToLocalStorage("savedFlashcards", object);
      } else if (mode === AVAILABLE_MODES.MATCHING) {
        setMatchingPairs(object as MatchingPair[]);
        saveToLocalStorage("savedMatchingGames", object);
      }
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload a PDF before generating.");
      return;
    }

    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );

    // Generate title for the questions
    const generatedTitle = await generateTitle(encodedFiles[0].name, mode);
    setTitle(generatedTitle);
    submit({files: encodedFiles});
  };

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
                `Generate ${capitalizeString(mode)}`
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <LoadingProgress
            progress={object ? (object.length / 4) * 100 : 0}
            isLoading={isLoading}
            partialCount={object?.length}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

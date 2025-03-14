import {Button} from "@/components/ui/button";

interface ModeSelectorProps {
  mode: "flashcards" | "quiz";
  setMode: (mode: "flashcards" | "quiz") => void;
}

export default function ModeSelector({mode, setMode}: ModeSelectorProps) {
  return (
    <div className="flex justify-center gap-3 mb-4">
      <Button
        variant={mode === "quiz" ? "default" : "outline"}
        onClick={() => setMode("quiz")}
      >
        Quiz Mode
      </Button>
      <Button
        variant={mode === "flashcards" ? "default" : "outline"}
        onClick={() => setMode("flashcards")}
      >
        Flashcards Mode
      </Button>
    </div>
  );
}

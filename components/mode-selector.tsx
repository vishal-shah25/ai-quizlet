import {Button} from "@/components/ui/button";
import {AVAILABLE_MODES} from "@/utils/constants";
import {capitalizeString} from "@/utils/helpers";
import {ModeType} from "@/utils/types";

interface ModeSelectorProps {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

export default function ModeSelector({mode, setMode}: ModeSelectorProps) {
  return (
    <div className="flex justify-center gap-3 mb-4">
      {Object.values(AVAILABLE_MODES).map((value) => (
        <Button
          key={value}
          variant={mode === value ? "default" : "outline"}
          onClick={() => setMode(value)}
        >
          {capitalizeString(value)}
        </Button>
      ))}
    </div>
  );
}

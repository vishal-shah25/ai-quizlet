"use client";

import {Progress} from "@/components/ui/progress";

interface LoadingProgressProps {
  progress: number;
  isLoading: boolean;
  partialCount?: number;
}

export default function LoadingProgress({
  progress,
  isLoading,
  partialCount,
}: LoadingProgressProps) {
  if (!isLoading) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="w-full space-y-2">
        <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              isLoading ? "bg-yellow-500/50 animate-pulse" : "bg-muted"
            }`}
          />
          <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
            {partialCount
              ? `Generating question ${partialCount + 1} of 4`
              : "Analyzing PDF content"}
          </span>
        </div>
      </div>
    </div>
  );
}

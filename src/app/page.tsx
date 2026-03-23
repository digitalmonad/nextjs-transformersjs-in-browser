"use client";

import { Dropzone } from "@/components/dropzone";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDetector } from "@/hooks/use-detector";
import { MODEL_NAME } from "@/lib/types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Howto } from "@/components/how-to";

export default function Home() {
  const detector = useDetector();

  return (
    <div className="py-12">
      <div className="mx-auto container max-w-4xl flex flex-col gap-2">
        <div className="flex flex-col border rounded-lg bg-card">
          <div className="bg-border rounded-t-lg p-2">
            <h1 className="text-lg text-foreground font-bold">
              @huggingface/transformers object detection
            </h1>
          </div>
          <div className="flex p-2 items-center justify-between gap-4">
            {detector.ready !== null && detector.ready ? (
              <div className="flex justify-end gap-2">
                <p>{MODEL_NAME} is ready!</p>
                <Check />
              </div>
            ) : (
              <div className="flex-1 text-start">
                <p>Detector status</p>
                <Progress value={detector.progress} />
              </div>
            )}
            <div>
              <Button
                variant={detector.ready ? "outline" : "default"}
                onClick={() => detector.downloadModel?.()}
                disabled={detector.ready === true}
              >
                {detector.ready === true ? "Downloaded" : "Download Model"}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="p-2">
            <Dropzone
              status={detector.status}
              setStatus={detector.setStatus}
              detector={detector.start}
              result={detector.result}
              setResult={detector.setResult}
            />
          </div>
        </div>
        <Howto />
      </div>
    </div>
  );
}

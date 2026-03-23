"use client";

import Dropzone from "@/components/dropzone";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDetector } from "@/hooks/use-detector";
import { MODEL_NAME } from "@/lib/worker.types";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const detector = useDetector();

  return (
    <div className="py-12">
      <div className="mx-auto container max-w-4xl flex flex-col gap-2">
        <div className="flex flex-col border rounded-lg">
          <div className="bg-black rounded-t-lg p-2">
            <h1 className="text-lg text-background font-bold">
              @huggingface/transformers object detection
            </h1>
          </div>
          <div className="flex p-2 items-center justify-between gap-4">
            {detector.ready !== null && detector.ready ? (
              <div className="flex justify-end gap-2 text-emerald-600">
                <p>{MODEL_NAME} is ready!</p>
                <Check />
              </div>
            ) : (
              <div className="flex-1 text-end">
                <p>Detector status</p>
                <Progress value={detector.progress} />
              </div>
            )}

            {/* Manual download button to prefetch the ML model */}
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
        <div className="flex flex-col gap-1 border rounded-lg p-3 text-sm text-muted-foreground">
          <p>
            Running entirely in the browser via{" "}
            <a
              href="https://huggingface.co/docs/transformers.js/index"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Transformers.js
            </a>{" "}
            — no server, no API calls, no data leaves your device.
          </p>
          <p>
            Model:{" "}
            <a
              href="https://huggingface.co/Xenova/detr-resnet-50"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              {MODEL_NAME}
            </a>{" "}
            (DETR ResNet-50, fine-tuned on COCO 2017, 80 object categories)
          </p>
        </div>
      </div>
    </div>
  );
}

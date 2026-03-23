"use client";

import Dropzone from "@/components/dropzone";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDetector } from "@/hooks/use-detector";
import { Check } from "lucide-react";

export default function Home() {
  const detector = useDetector();

  return (
    <section className="py-12">
      <div className="mx-auto container max-w-3xl">
        <div className="flex flex-col border rounded-lg">
          <div className="bg-black rounded-t-lg p-2">
            <h1 className="text-lg text-background font-bold">
              @huggingface/transformers object detection
            </h1>
          </div>
          <div className="flex p-2">
            {detector.ready !== null && detector.ready ? (
              <div className="flex justify-end gap-2 text-emerald-600">
                <p>Detector Ready</p>
                <Check />
              </div>
            ) : (
              <div className="text-end">
                <p>Detector status</p>
                <Progress value={detector.progress} />
              </div>
            )}
          </div>
          <Separator />
          <Dropzone
            status={detector.status}
            setStatus={detector.setStatus}
            detector={detector.start}
            result={detector.result}
            setResult={detector.setResult}
            className="mt-10"
          />
        </div>
      </div>
    </section>
  );
}

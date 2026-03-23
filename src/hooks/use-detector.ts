"use client";

import { useState, useCallback } from "react";
import { useWorker } from "@/hooks/use-worker";
import { toast } from "sonner";
import type { DetectionResult, WorkerMessageName } from "@/lib/types";

export function useDetector() {
  const [result, setResult] = useState<DetectionResult[] | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<WorkerMessageName | "">("");

  const worker = useWorker((e: MessageEvent) => {
    const { name, payload } = e.data;
    switch (name) {
      case "model:loading":
        toast.info("Downloading model...");
        setStatus("model:loading");
        setReady(false);
        break;
      case "model:progress":
        setStatus("model:progress");
        setProgress(payload?.progress?.progress ?? 0);
        break;
      case "model:ready":
        toast.success("Model downloaded and ready!");
        setStatus("model:ready");
        setReady(true);
        break;
      case "detection:complete": {
        const count = payload.result?.length ?? 0;
        if (count === 0) {
          toast.warning("Detection complete — no objects found.");
        } else {
          toast.success(
            `Detection complete — found ${count} object${count > 1 ? "s" : ""}.`,
          );
        }
        setStatus("detection:complete");
        setResult(payload.result);
        break;
      }
      case "error":
        setStatus("error");
        setReady(null);
        toast.error(payload?.error ?? "Detection failed");
        break;
    }
  });

  const start = useCallback(
    (image: string | ArrayBuffer | null) => {
      if (worker) {
        worker.postMessage({ name: "detect", payload: { image } });
      }
    },
    [worker],
  );

  const downloadModel = useCallback(() => {
    if (worker) {
      worker.postMessage({ name: "preload" });
    }
  }, [worker]);

  return {
    result,
    setResult,
    ready,
    progress,
    status,
    setStatus,
    start,
    downloadModel,
  };
}

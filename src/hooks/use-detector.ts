"use client";

import { useState, useCallback } from "react";
import { useWorker } from "@/hooks/use-worker";

type DetectionResult = {
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  label: string;
  score: number;
};

export function useDetector() {
  const [result, setResult] = useState<DetectionResult[] | null>(null);
  const [ready, setReady] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const worker = useWorker((e: MessageEvent) => {
    switch (e.data.status) {
      case "initiate":
        setStatus("initiate");
        setReady(false);
        break;
      case "progress":
        setStatus("progress");
        setProgress(e.data.progress);
        break;
      case "ready":
        setStatus("ready");
        setReady(true);
        break;
      case "complete":
        setStatus("complete");
        setResult(e.data.result);
        break;
      case "error":
        setStatus("error");
        setReady(null);
        break;
    }
  });

  const start = useCallback(
    (image: string | ArrayBuffer | null) => {
      if (worker) {
        worker.postMessage({ image });
      }
    },
    [worker],
  );

  return { result, setResult, ready, progress, status, setStatus, start };
}

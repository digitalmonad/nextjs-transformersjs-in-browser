import { pipeline, env, PipelineType } from "@huggingface/transformers";
import type { WorkerIncomingMessage } from "./types";
import { MODEL_NAME } from "./types";

env.allowLocalModels = false;

class Pipeline {
  static task: PipelineType = "object-detection";
  static model = MODEL_NAME;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static instance: Promise<any> | null = null;

  static async getInstance(
    progress_callback: ((x: unknown) => void) | undefined,
  ) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

const progressCallback = (progress: unknown) => {
  self.postMessage({ name: "model:progress", payload: { progress } });
};

self.addEventListener(
  "message",
  async (event: MessageEvent<WorkerIncomingMessage>) => {
    try {
      const data = event.data || {};

      // If caller requested only to preload the model, do that and return.
      if (data.name === "preload") {
        self.postMessage({ name: "model:loading" });
        await Pipeline.getInstance(progressCallback);
        self.postMessage({ name: "model:ready" });
        return;
      }

      // Otherwise, ensure pipeline instance is ready and run detection on the provided image.
      // If the model hasn't been loaded yet, broadcast loading lifecycle events.
      const wasLoading = Pipeline.instance === null;
      if (wasLoading) {
        self.postMessage({ name: "model:loading" });
      }
      const detector = await Pipeline.getInstance(progressCallback);
      if (wasLoading) {
        self.postMessage({ name: "model:ready" });
      }
      const result = await detector(
        data.name === "detect" ? data.payload.image : null,
        { percentage: true },
      );
      self.postMessage({ name: "detection:complete", payload: { result } });
    } catch (error) {
      self.postMessage({
        name: "error",
        payload: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
    }
  },
);

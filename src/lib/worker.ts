import { pipeline, env, PipelineType } from "@huggingface/transformers";

env.allowLocalModels = false;

class Pipeline {
  static task: PipelineType = "object-detection";
  static model = "Xenova/detr-resnet-50";
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

self.addEventListener("message", async (event) => {
  try {
    const detector = await Pipeline.getInstance((x: unknown) => {
      self.postMessage(x);
    });
    const result = await detector(event.data.image, { percentage: true });
    self.postMessage({ status: "complete", result });
  } catch (error) {
    self.postMessage({
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

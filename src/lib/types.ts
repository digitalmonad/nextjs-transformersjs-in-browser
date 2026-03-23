// Shared types for communication between the worker and the main thread.

export const MODEL_NAME = "Xenova/detr-resnet-50";

export type WorkerIncomingMessage =
  | { name: "preload" }
  | { name: "detect"; payload: { image: string | ArrayBuffer | null } };

export type WorkerOutgoingMessage =
  | { name: "model:loading" }
  | { name: "model:progress"; payload: { progress: unknown } }
  | { name: "model:ready" }
  | { name: "detection:complete"; payload: { result: DetectionResult[] } }
  | { name: "error"; payload: { error: string } };

export type WorkerMessageName = WorkerOutgoingMessage["name"];

/** Extract the payload type for a given outgoing message name. */
export type WorkerPayload<N extends WorkerMessageName> =
  Extract<WorkerOutgoingMessage, { name: N }> extends { payload: infer P }
    ? P
    : never;

export type DetectionResult = {
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  label: string;
  score: number;
};

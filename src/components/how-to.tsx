import { MODEL_NAME } from "@/lib/types";

export const Howto = () => {
  return (
    <div className="flex flex-col gap-2 border rounded-lg p-4 text-sm text-muted-foreground bg-card">
      <p className="font-semibold text-foreground">How it works</p>
      <ol className="list-decimal list-inside flex flex-col gap-1">
        <li>
          <span className="font-medium text-foreground">Model download</span> —
          click <em>Download Model</em> to fetch the weights from Hugging Face.
          The model is cached in the browser after the first download.
        </li>
        <li>
          <span className="font-medium text-foreground">Image upload</span> —
          drag &amp; drop or click to select an image (JPEG/PNG, max 1 MB).
        </li>
        <li>
          <span className="font-medium text-foreground">Detection</span> — the
          image is processed in a{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Web Worker
          </a>{" "}
          using{" "}
          <a
            href="https://huggingface.co/docs/transformers.js/index"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Transformers.js
          </a>
          . No data ever leaves your device.
        </li>
        <li>
          <span className="font-medium text-foreground">Results</span> —
          bounding boxes appear on the image; the right panel lists every
          detected object with its confidence score.
        </li>
      </ol>
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
  );
};

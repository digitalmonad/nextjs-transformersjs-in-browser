"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import BoundingBox from "./bounding-box";
import { toast } from "sonner";
import type { DetectionResult, WorkerMessageName } from "@/lib/types";
import { Button } from "./ui/button";

type FileWithPreview = File & { preview: string };

export function Dropzone({
  status,
  setStatus,
  detector,
  result,
  setResult,
  className,
}: {
  status: WorkerMessageName | "";
  setStatus: (status: WorkerMessageName | "") => void;
  detector: (image: string | ArrayBuffer | null) => void;
  result: DetectionResult[] | null;
  setResult: (result: DetectionResult[] | null) => void;
  className?: string;
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (accepted: File[], rejectedFiles: FileRejection[]) => {
      if (accepted?.length) {
        setFiles([
          ...accepted.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) }),
          ),
        ]);

        setStatus("model:ready");
        setResult(null);
        toast.info("Image accepted — running detection…");

        const reader = new FileReader();

        reader.onload = function (e) {
          const image = e?.target?.result;
          if (image !== undefined) {
            detector(image);
          }
        };

        reader.onerror = function () {
          toast.error("Failed to read the image file.");
        };

        reader.readAsDataURL(accepted[0]);
      }

      if (rejectedFiles?.length) {
        rejectedFiles.forEach(({ file, errors }) => {
          const reasons = errors.map((e) => e.message).join(", ");
          toast.error(`"${file.name}" was rejected: ${reasons}`);
        });
      }
    },
    [detector, setResult, setStatus],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const remove = () => {
    setFiles([]);
    toast.info("Image removed.");
  };

  const loadExample = useCallback(async () => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const response = await fetch(`${basePath}/cat.jpg`);
      const blob = await response.blob();
      const file = Object.assign(
        new File([blob], "cat.jpg", { type: blob.type }),
        { preview: URL.createObjectURL(blob) },
      ) as FileWithPreview;

      setFiles([file]);
      setStatus("model:ready");
      setResult(null);
      toast.info("Example image loaded — running detection…");

      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e?.target?.result;
        if (image !== undefined) {
          detector(image);
        }
      };
      reader.onerror = () => toast.error("Failed to read the example image.");
      reader.readAsDataURL(blob);
    } catch {
      toast.error("Failed to load the example image.");
    }
  }, [detector, setResult, setStatus]);

  return (
    <>
      <div
        {...getRootProps({
          className: cn("rounded-md py-10 border-dashed border-2", className),
        })}
      >
        <input {...getInputProps({ name: "file" })} />
        <div className="flex flex-col items-center justify-center gap-4">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, click to select files</p>
          )}
          <Button
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              loadExample();
            }}
            className="text-sm underline text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            or try the example image
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="">
        {files.length > 0 && (
          <div className="mt-6 flex gap-4">
            {/* Left: image with bounding boxes */}
            <div className="relative flex-1 h-96 rounded-lg border">
              <Image
                src={files[0].preview}
                alt={files[0].name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoad={() => {
                  URL.revokeObjectURL(files[0].preview);
                }}
                className={cn(
                  "rounded-lg object-cover",
                  status !== "detection:complete" && "animate-pulse",
                )}
              />

              {result &&
                result.map((object, index) => (
                  <BoundingBox key={index} object={object} />
                ))}

              <button
                type="button"
                className="absolute -left-3 -top-3 z-10 flex h-5 w-5 items-center justify-center rounded-md border border-destructive bg-destructive text-white transition-colors hover:bg-white hover:text-destructive cursor-pointer"
                onClick={remove}
              >
                <X strokeWidth={1.5} className="h-5 w-5" />
              </button>
              {status !== "detection:complete" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xl font-semibold text-white">
                  Detecting Objects...
                </div>
              )}
            </div>

            {/* Right: detected objects list */}
            <div className="w-52 flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Detected objects
              </p>
              {status !== "detection:complete" ? (
                <p className="text-sm text-muted-foreground">Detecting…</p>
              ) : result && result.length > 0 ? (
                <ul className="flex flex-col gap-1 overflow-y-auto max-h-96">
                  {result.map((object, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md border px-2 py-1 text-sm"
                    >
                      <span className="font-medium capitalize">
                        {object.label}
                      </span>
                      <span className="text-muted-foreground">
                        {(object.score * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No objects detected.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

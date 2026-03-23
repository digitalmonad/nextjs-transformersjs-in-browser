"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import BoundingBox from "./bounding-box";
import type { DetectionResult, WorkerMessageName } from "@/lib/worker.types";

type FileWithPreview = File & { preview: string };

export default function Dropzone({
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
  const [rejected, setRejected] = useState<FileRejection[]>([]);

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

        const reader = new FileReader();

        reader.onload = function (e) {
          const image = e?.target?.result;
          if (image !== undefined) {
            detector(image);
          }
        };

        reader.readAsDataURL(accepted[0]);
      }

      if (rejectedFiles?.length) {
        setRejected(rejectedFiles);
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
    setRejected([]);
  };

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
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="">
        {files.length > 0 && (
          <div className="mt-6 relative h-125 rounded-lg shadow-lg">
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
              className="absolute -right-3 -top-3 z-10 flex h-5 w-5 items-center justify-center rounded-md border border-destructive bg-destructive text-white transition-colors hover:bg-white hover:text-destructive cursor-pointer"
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
        )}

        {rejected.length > 0 && (
          <div>
            <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-gray-600">
              Rejected Files
            </h3>
            <ul className="mt-6 flex flex-col">
              {rejected.map(({ file, errors }) => (
                <li
                  key={file.name}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="mt-2 text-sm font-medium text-gray-500">
                      {file.name}
                    </p>
                    <ul className="text-[12px] text-red-400">
                      {errors.map((error) => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="mt-1 rounded-lg border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-gray-500 transition-colors hover:bg-rose-400 hover:text-white"
                    onClick={remove}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

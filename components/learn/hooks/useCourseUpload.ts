"use client";

import { usePresignUploadMutation } from "@/store/api/coursesApi";
import type { UploadProgress } from "../types";

function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("S3 upload network error")));
    xhr.addEventListener("abort", () => reject(new Error("S3 upload aborted")));
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
  });
}

export function useCourseUpload() {
  const [presign] = usePresignUploadMutation();

  async function uploadFile(
    file: File,
    uploadType: "source" | "thumbnail",
    onProgress: (progress: UploadProgress) => void,
  ): Promise<string> {
    onProgress({ pct: 0, status: "uploading" });

    let presignData;
    try {
      presignData = await presign({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        uploadType,
      }).unwrap();
    } catch {
      onProgress({ pct: 0, status: "error" });
      throw new Error("Failed to get upload URL.");
    }

    try {
      await uploadToS3(presignData.url, file, (pct) => {
        onProgress({ pct, status: "uploading" });
      });
    } catch (err) {
      onProgress({ pct: 0, status: "error" });
      throw err;
    }

    onProgress({ pct: 100, status: "done" });
    return presignData.key;
  }

  return { uploadFile };
}

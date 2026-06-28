export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExt(filename: string): string {
  return filename.includes(".") ? filename.rsplit?.(".", 1)[1] ?? filename.split(".").pop() ?? "" : "";
}

export function truncateCategories(cats: string[], max = 2): { visible: string[]; rest: number } {
  return { visible: cats.slice(0, max), rest: Math.max(0, cats.length - max) };
}

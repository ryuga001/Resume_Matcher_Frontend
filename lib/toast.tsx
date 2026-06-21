"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const Icon = toast.type === "success" ? CheckCircle2 : toast.type === "error" ? AlertCircle : Info;
  const colors = {
    success: "bg-card border-success/30 text-foreground",
    error:   "bg-card border-destructive/30 text-foreground",
    info:    "bg-card border-border text-foreground",
  };
  const iconColors = {
    success: "text-success",
    error:   "text-destructive",
    info:    "text-muted-foreground",
  };

  return (
    <div className={cn(
      "pointer-events-auto flex items-start gap-3 rounded-md border px-4 py-3 shadow-lg text-sm max-w-xs animate-in slide-in-from-bottom-2 fade-in",
      colors[toast.type]
    )}>
      <Icon className={cn("size-4 mt-0.5 shrink-0", iconColors[toast.type])} />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);

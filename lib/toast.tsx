"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast { id: string; message: string; type: ToastType }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

const CONFIG: Record<ToastType, {
  bg: string; border: string; text: string; iconColor: string; closeColor: string; label: string; Icon: typeof CheckCircle2;
}> = {
  success: {
    bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", iconColor: "#16a34a", closeColor: "#86efac",
    label: "Success", Icon: CheckCircle2,
  },
  error: {
    bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", iconColor: "#ef4444", closeColor: "#fca5a5",
    label: "Failed", Icon: AlertCircle,
  },
  info: {
    bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", iconColor: "#3b82f6", closeColor: "#93c5fd",
    label: "Info", Icon: Info,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { bg, border, text, iconColor, closeColor, label, Icon } = CONFIG[toast.type];

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 shadow-md min-w-[260px] max-w-[340px]"
      style={{ background: bg, border: `1px solid ${border}`, animation: "toast-in 0.2s ease forwards" }}
    >
      <Icon className="size-4 mt-0.5 shrink-0" style={{ color: iconColor }} strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: iconColor }}>
          {label}
        </p>
        <p className="text-sm leading-snug" style={{ color: text }}>{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 mt-0.5 transition-opacity hover:opacity-60"
        style={{ color: closeColor }}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);

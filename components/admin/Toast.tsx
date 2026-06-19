"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

export function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-admin max-w-sm w-full sm:w-auto",
        "animate-fade-up border",
        type === "success"
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      )}
    >
      {type === "success"
        ? <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
        : <XCircle    size={18} className="text-red-600   flex-shrink-0 mt-0.5" />
      }
      <p className={cn(
        "text-sm flex-1 leading-snug",
        type === "success" ? "text-green-800" : "text-red-800"
      )}>
        {message}
      </p>
      <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 flex-shrink-0 mt-0.5">
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    key: number;
  } | null>(null);

  const showToast = (message: string, type: ToastType) =>
    setToast({ message, type, key: Date.now() });

  const closeToast = () => setToast(null);

  return { toast, showToast, closeToast };
}

"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type ToastContextType = {
  toasts: { id: number; message: string; type: "success" | "error" }[];
  addToast: (message: string, type?: "success" | "error") => void; // ✅ adicionar aqui
};

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {}, // ✅ default vazio
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastContextType["toasts"]>([]);

  function addToast(message: string, type: "success" | "error" = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // remove após 3s
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      {/* Aqui você pode renderizar os toasts na tela */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white ${
              t.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

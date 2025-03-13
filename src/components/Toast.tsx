import React, { createContext, useContext, useState } from "react";
import { Toast as BootstrapToast, ToastContainer } from "react-bootstrap";

export type ToastVariantType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface ToastProps {
  id: string; // Unique identifier
  title: string;
  content: string;
  delay?: number;
  variant: ToastVariantType;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id">) => {
    console.log("Adding toast:", toast);
    const newToast = { ...toast, id: crypto.randomUUID() }; // Unique ID for tracking
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, newToast.delay || 30000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        {toasts.map((toast) => (
          <BootstrapToast
            key={toast.id}
            className={`bg-${toast.variant}`}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            delay={toast.delay || 3000}
            autohide
          >
            <BootstrapToast.Header closeButton={false}>
              <strong className="mr-auto">{toast.title}</strong>
            </BootstrapToast.Header>
            <BootstrapToast.Body>{toast.content}</BootstrapToast.Body>
          </BootstrapToast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

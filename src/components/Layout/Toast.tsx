// ToastContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
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
  id: string;
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

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const defaultDelay = 3000;

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeouts.current.get(id);
    if (timeout) clearTimeout(timeout);
    timeouts.current.delete(id);
  };

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = generateId();
    const newToast: ToastProps = {
      ...toast,
      id,
      delay: toast.delay ?? defaultDelay,
    };
    setToasts((prev) => [...prev, newToast]);

    const timeout = setTimeout(() => {
      removeToast(id);
    }, newToast.delay);
    timeouts.current.set(id, timeout);
  };

  // Cleanup on unmount
  useEffect(() => {
    const currentTimeouts = timeouts.current;
    return () => {
      Object.values(currentTimeouts).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ position: "fixed", top: 0, right: 0, zIndex: 1050 }}
      >
        {toasts.map((toast) => (
          <BootstrapToast
            key={toast.id}
            className={`bg-${toast.variant} text-white`}
            onClose={() => removeToast(toast.id)}
            delay={toast.delay}
            style={{ width: "300px" }}
            autohide
          >
            <BootstrapToast.Header closeButton>
              <strong className="me-auto">{toast.title}</strong>
            </BootstrapToast.Header>
            <BootstrapToast.Body>{toast.content}</BootstrapToast.Body>
          </BootstrapToast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

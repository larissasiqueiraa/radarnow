import { createContext, useContext, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info", duration = 3500) {
    setToast({
      id: Date.now(),
      message,
      type,
    });

    window.clearTimeout(window.__radarToastTimer);

    window.__radarToastTimer = window.setTimeout(() => {
      setToast(null);
    }, duration);
  }

  function hideToast() {
    window.clearTimeout(window.__radarToastTimer);
    setToast(null);
  }

  function getIcon() {
    if (toast?.type === "success") {
      return <CheckCircle size={21} />;
    }

    if (toast?.type === "error") {
      return <AlertCircle size={21} />;
    }

    return <Info size={21} />;
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <div className="toast-icon">{getIcon()}</div>

          <span className="toast-message">{toast.message}</span>

          <button
            type="button"
            className="toast-close"
            onClick={hideToast}
            aria-label="Fechar notificação"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast precisa estar dentro de ToastProvider.");
  }

  return context;
}
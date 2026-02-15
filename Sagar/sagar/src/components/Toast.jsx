import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

function Toast({ message, type = "success" }) {
  const { hideToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast();
    }, 2000);

    return () => clearTimeout(timer);
  }, [hideToast]);

  return <div className={`toast toast-${type}`}>{message}</div>;
}

export default Toast;

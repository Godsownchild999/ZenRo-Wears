import { useEffect } from "react";
import PropTypes from "prop-types";
import "./Toast.css";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} role="status">
      <span className="toast-icon">
        {type === "success" ? "✓" : type === "error" ? "✕" : "ⓘ"}
      </span>
      <p>{message}</p>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  type: "success",
};

export default Toast;
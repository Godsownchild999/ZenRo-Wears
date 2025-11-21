import PropTypes from "prop-types";
import "./styles/LoadingSpinner.css";

function LoadingSpinner({ message }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
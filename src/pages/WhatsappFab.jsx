import { FaWhatsapp } from "react-icons/fa";
import PropTypes from "prop-types";
import "./WhatsappFab.css";

function WhatsappFab({ phoneNumber, presetMessage, hidden }) {
  if (hidden) return null;

  const encoded = encodeURIComponent(presetMessage ?? "Hello ZenRo, I need some assistance.");

  return (
    <a
      className="whatsapp-fab"
      href={`https://wa.me/${phoneNumber}?text=${encoded}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

WhatsappFab.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  presetMessage: PropTypes.string,
  hidden: PropTypes.bool,
};

export default WhatsappFab;
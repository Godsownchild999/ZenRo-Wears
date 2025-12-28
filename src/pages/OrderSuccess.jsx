import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER ?? "2349044592275";

function OrderSuccess() {
  const { state } = useLocation();
  const total = state?.total ?? 0;

  const { orderId } = state ?? {};

  const safeOrderId =
    orderId ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `ZENRO-${Date.now()}`);


  // Build detailed order message for WhatsApp
  const items = state?.items || [];
  let itemLines = items.map((item, idx) => {
    let line = `${idx + 1}. ${item.name}`;
    if (item.size) line += ` (Size: ${item.size})`;
    if (item.quantity) line += ` x${item.quantity}`;
    if (item.price) line += ` - ₦${Number(item.price).toLocaleString()}`;
    if (item.image || (item.images && item.images.front)) {
      const imgUrl = item.image || (item.images && item.images.front);
      line += `\n   [Image] ${imgUrl}`;
    }
    return line;
  }).join("\n");

  const orderMessage =
    `Hello, I just placed an order (ref ${safeOrderId}) with total ₦${Number(total || 0).toLocaleString()}\n` +
    `\nOrder details:\n${itemLines}` +
    (state?.customerName ? `\nName: ${state.customerName}` : "") +
    (state?.customerPhone ? `\nPhone: ${state.customerPhone}` : "") +
    (state?.customerEmail ? `\nEmail: ${state.customerEmail}` : "");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;

  const handleWhatsappClick = useCallback(() => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, [whatsappUrl]);

  // No automated redirect—user decides when to open WhatsApp.

  if (!state) {
    return (
      <section className="page order-success">
        <h1>Order confirmed</h1>
        <p>
          We couldn’t retrieve your order summary automatically. Please reach us on WhatsApp
          or return to the shop to place an order.
        </p>
        <Link to="/shop" className="btn btn-dark">
          Back to shop
        </Link>
      </section>
    );
  }

  return (
    <div className="order-success page-fade-in">
      <div className="card">
        <div className="icon">✅</div>
        <h1>Order confirmed</h1>
        <p>
          Thank you for shopping with ZenRo. We’ve sent a confirmation email with your order
          details and tracking instructions.
        </p>

        <div className="summary">
          <p>
            <span>Order total</span>
            <strong>₦{Number(total || 0).toLocaleString()}</strong>
          </p>
          <p>
            <span>Status</span>
            <strong>Processing</strong>
          </p>
        </div>

        <div className="actions">
          <Link to="/shop" className="btn btn-outline-dark">
            Continue shopping
          </Link>
          <Link to="/myorders" className="btn btn-dark">
            Track orders
          </Link>
          <button
            type="button"
            onClick={handleWhatsappClick}
            className="btn btn-success"
          >
            Finalise on WhatsApp
          </button>
        </div>
        <p className="mt-3 text-muted small">
          Click “Finalise on WhatsApp” whenever you’re ready—we’ll open the chat with your full order summary.
        </p>
        <p className="order-id">Order reference: {safeOrderId}</p>
      </div>
    </div>
  );
}

export default OrderSuccess;
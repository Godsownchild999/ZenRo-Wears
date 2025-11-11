import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css";

function Contact() {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage("");

    emailjs
      .sendForm(
        "service_rv66txo",    // ✅ your EmailJS service ID
        "template_i0ailda",   // ✅ your EmailJS template ID
        form.current,
        "AORyOldMDX1Nr7JgX" // ✅ your EmailJS public key
      )
      .then(
        () => {
          setStatusMessage("✅ Message sent successfully!");
          setIsSending(false);
          form.current.reset();
        },
        (error) => {
          console.error("Email error:", error);
          setStatusMessage("❌ Failed to send message. Try again later.");
          setIsSending(false);
        }
      );
  };

  return (
    <section className="contact-page py-5">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold">Contact ZenRo Wears</h2>
          <p className="text-muted">
            We’d love to hear from you — whether it’s inquiries, collaborations, or feedback.
          </p>
        </div>

        <div className="row g-4 align-items-center">
          {/* Contact Form */}
          <div className="col-md-6" data-aos="fade-right">
            <form ref={form} onSubmit={sendEmail} className="p-4 shadow rounded bg-white">
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="Enter your name" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="you@example.com" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Type your message..."
                  required
                ></textarea>
              </div>

              {/* Loading Spinner or Button */}
              <button
                type="submit"
                className="btn btn-dark rounded-pill px-4 d-flex align-items-center justify-content-center"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              {/* Status Message */}
              {statusMessage && (
                <p className="mt-3 fw-semibold text-center status-text">
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="col-md-6" data-aos="fade-left">
            <div className="p-4">
              <h5 className="fw-bold mb-3">Get in Touch</h5>
              <p><strong>Email:</strong> support@zenrowears.com</p>
              <p><strong>Phone:</strong> +234 904 459 2275</p>
              <p><strong>Instagram:</strong> @zenrowears</p>
              <p><strong>Location:</strong> Lagos, Nigeria</p>
              <p className="text-muted mt-3">
                Our team typically replies within 24–48 hours.  
                We value every message you send.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
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
    <div className="contact-page page-fade-in">
      <section className="contact-hero">
        <h1>Let’s build together</h1>
        <p>Have questions, collab ideas, or wholesale inquiries? Drop us a line.</p>
      </section>

      <div className="contact-layout container">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="contact-form p-4 shadow rounded bg-white"
        >
          <label>
            Full name
            <input type="text" name="name" placeholder="Your name" required />
          </label>
          <label>
            Email address
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            Topic
            <select name="topic" defaultValue="support">
              <option value="support">Order support</option>
              <option value="collab">Collaboration</option>
              <option value="stockist">Wholesale / Stockist</option>
              <option value="press">Press / Media</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" rows="5" placeholder="Write your message..." required></textarea>
          </label>
          {/* Loading Spinner or Button */}
          <button
            type="submit"
            className="btn btn-dark rounded-pill px-4 d-flex align-items-center justify-content-center contact-btn"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </button>

          {/* Status Message */}
          {statusMessage && (
            <p className="mt-3 fw-semibold text-center status-text">
              {statusMessage}
            </p>
          )}
        </form>

        <aside className="contact-info">
          <div>
            <h2>Reach us</h2>
            <p>hello@zenrowears.com</p>
            <p>+234 800 000 0000</p>
          </div>
          <div>
            <h2>Visit</h2>
            <p>ZenRo Studio<br />Lekki Phase 1, Lagos</p>
          </div>
          <div>
            <h2>Hours</h2>
            <p>Mon – Sat: 9am – 6pm</p>
            <p>Sun: Closed</p>
          </div>
          <div className="contact-socials">
            <h2>Social</h2>
            <a href="https://instagram.com" aria-label="Instagram">@ZenRoWears</a>
            <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
            <a href="https://tiktok.com" aria-label="TikTok">TikTok</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Contact;
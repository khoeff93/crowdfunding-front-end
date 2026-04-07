import { useState } from "react";

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="contact-form" id="contact"><p>Thank you for your request!</p></div>;
  }

  return (
    <div className="contact-form" id="contact">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" placeholder="Your name" />

        <label>Email</label>
        <input type="email" placeholder="Your email" />

        <label>Message</label>
        <textarea placeholder="Your message" rows="5" />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContactForm;
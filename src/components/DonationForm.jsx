// DonationForm
// The donation form that appears BELOW the fundraiser card when you click Donate.
// No login needed. The card details are a dummy/placeholder for now - they are
// NOT sent anywhere or connected to a real payment system.

import { useState } from "react";
import postPledge from "../api/post-pledge.js";
import "./DonationForm.css";

// The quick-pick amounts shown as buttons
const PRESET_AMOUNTS = [100, 200, 300, 500, 750, 1000];

function DonationForm({ fundraiser, onSuccess }) {
  // The donation amount (filled by a preset button OR typed in by hand)
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  // Dummy card fields - just for show, nothing is sent to a payment system
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Make sure the amount is a real number bigger than $0
    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please choose or enter an amount greater than $0.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the pledge with no token, so no login is needed.
      // anonymous is true because there is no logged-in supporter.
      await postPledge({
        amount: parsedAmount,
        comment: comment,
        anonymous: true,
        fundraiser: fundraiser.id,
      });

      onSuccess(parsedAmount);

    } catch (err) {
      setError(err.message);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="donation-form" onSubmit={handleSubmit}>

      <h3>Donate to {fundraiser.title}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Quick-pick amount buttons */}
      <div className="amount-buttons">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            type="button"
            key={preset}
            className={Number(amount) === preset ? "amount-button selected" : "amount-button"}
            onClick={() => setAmount(String(preset))}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Or type your own amount */}
      <label>Amount ($ AUD)</label>
      <input
        type="number"
        min="1"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label>Leave a message (optional)</label>
      <textarea
        placeholder="Say something nice..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />

      {/* Dummy payment section - not connected to anything yet */}
      <h4>Payment details</h4>
      <p className="dummy-note">Demo only - do not enter real card details.</p>

      <label>Name on card</label>
      <input
        type="text"
        placeholder="Jane Doe"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />

      <label>Card number</label>
      <input
        type="text"
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <div className="card-row">
        <div>
          <label>Expiry</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
        <div>
          <label>CVC</label>
          <input
            type="text"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="donate-submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : `Donate ${amount ? "$" + amount : ""}`}
      </button>

    </form>
  );
}

export default DonationForm;

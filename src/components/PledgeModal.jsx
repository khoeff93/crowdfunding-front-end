// PledgeModal
// This is the pop-up box that lets a logged-in user donate to a fundraiser.
// It is used on both the Donation page and the single Fundraiser page.

import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import postPledge from "../api/post-pledge.js";
import "./PledgeModal.css";

function PledgeModal({ fundraiser, onClose, onSuccess }) {
  const { auth } = useAuth();

  // Form fields the user fills in
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // Keeps track of submitting + any error to show
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Make sure the amount is a real number bigger than $0
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than $0.");
      return;
    }

    setIsSubmitting(true);

    try {
      await postPledge(
        {
          amount: parsedAmount,
          comment: comment,
          anonymous: anonymous,
          fundraiser: fundraiser.id,
        },
        auth.token
      );

      onSuccess(parsedAmount);

    } catch (err) {
      setError(err.message);

    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user is NOT logged in, ask them to log in first
  if (!auth.token) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h2>Donate to {fundraiser.title}</h2>
          <p>You need to be logged in to donate.</p>
          <Link to="/login"><button>Log In</button></Link>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // If the user IS logged in, show the donation form
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <h2>Donate to {fundraiser.title}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          <div>
            <label>Amount ($)</label><br />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Comment (optional)</label><br />
            <textarea
              placeholder="Leave a message..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              {" "}Donate anonymously
            </label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Donation"}
          </button>

          <button type="button" onClick={onClose}>Cancel</button>

        </form>
      </div>
    </div>
  );
}

export default PledgeModal;

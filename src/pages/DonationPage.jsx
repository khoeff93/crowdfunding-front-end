import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import postPledge from "../api/post-pledge.js";
import "./DonationPage.css";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";


function FundraiserCard({ fundraiserData, onDonateClick }) {
  const { id, title, description, goal, pledges = [], is_open } = fundraiserData;

  const totalRaised = pledges.reduce((total, pledge) => total + Number(pledge.amount), 0);

  return (
    <div className="fundraiser-card">

      {fundraiserData.image && (
        <img src={fundraiserData.image} alt={title} />
      )}

      <h3>
        <Link to={`/fundraiser/${id}`}>{title}</Link>
      </h3>

      {description && <p>{description}</p>}

      <p><strong>${totalRaised}</strong> raised of ${Number(goal)} goal</p>

      <p>{is_open ? "Status: Open" : "Status: Closed"}</p>

      {is_open && (
        <button onClick={() => onDonateClick(fundraiserData)}>
          Donate
        </button>
      )}

    </div>
  );
}


function PledgeModal({ fundraiser, onClose, onSuccess }) {
  const { auth } = useAuth();

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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


function DonationPage() {
  const [fundraisers, setFundraisers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const getFundraisers = async () => {
    try {
      const response = await fetch(`${baseUrl}/fundraisers/`);

      if (!response.ok) {
        throw new Error(`Could not load fundraisers (error ${response.status})`);
      }

      const data = await response.json();
      const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
      setFundraisers(sortedData);

    } catch (err) {
      setFetchError(err.message);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFundraisers();
  }, []);

  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const query = searchQuery.toLowerCase();
    return (
      fundraiser.title.toLowerCase().includes(query) ||
      (fundraiser.description ?? "").toLowerCase().includes(query)
    );
  });

  const handleDonateClick = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setSuccessMessage(null);
  };

  const handlePledgeSuccess = (amount) => {
    setSelectedFundraiser(null);
    setSuccessMessage(`Thank you! Your donation of $${amount} has been received.`);
    getFundraisers();
  };

  return (
    <main className="donation-page">

      <h1>Support a Fundraiser</h1>
      <p>Browse all fundraisers below and make a difference today.</p>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      <input
        type="search"
        placeholder="Search fundraisers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading && <p>Loading fundraisers...</p>}

      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      {!isLoading && !fetchError && filteredFundraisers.length === 0 && (
        <p>No fundraisers found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
      )}

      <div className="donation-page-grid">
        {filteredFundraisers.map((fundraiser) => (
          <FundraiserCard
            key={fundraiser.id}
            fundraiserData={fundraiser}
            onDonateClick={handleDonateClick}
          />
        ))}
      </div>

      {selectedFundraiser && (
        <PledgeModal
          fundraiser={selectedFundraiser}
          onClose={() => setSelectedFundraiser(null)}
          onSuccess={handlePledgeSuccess}
        />
      )}

    </main>
  );
}

export default DonationPage;
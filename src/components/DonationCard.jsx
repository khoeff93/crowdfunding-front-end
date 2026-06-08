// DonationCard
// A single fundraiser shown as a card, with a Donate button.
// Used on the Donation page (list of all fundraisers) and the single Fundraiser page.

import { Link } from "react-router-dom";
import "./DonationCard.css";

function DonationCard({ fundraiserData, onDonateClick }) {
  const { id, title, description, goal, pledges = [], is_open } = fundraiserData;

  // Add up every pledge amount to get the total raised so far
  const totalRaised = pledges.reduce((total, pledge) => total + Number(pledge.amount), 0);

  return (
    <div className="donation-card">

      {fundraiserData.image && (
        <img src={fundraiserData.image} alt={title} />
      )}

      {/* Clicking the title takes you to that fundraiser's own page */}
      <h3>
        <Link to={`/fundraiser/${id}`}>{title}</Link>
      </h3>

      {description && <p>{description}</p>}

      <p><strong>${totalRaised}</strong> raised of ${Number(goal)} goal</p>

      <p>{is_open ? "Status: Open" : "Status: Closed"}</p>

      {/* Only show the Donate button if the fundraiser is still open */}
      {is_open && (
        <button onClick={() => onDonateClick(fundraiserData)}>
          Donate
        </button>
      )}

    </div>
  );
}

export default DonationCard;

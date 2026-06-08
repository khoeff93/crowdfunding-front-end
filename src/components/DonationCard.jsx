// DonationCard
// A single fundraiser shown as a card.
// On the Donation list page the WHOLE card is clickable (clickable=true)
// and takes you to that fundraiser's own page.
// On the single Fundraiser page it shows a Donate button instead.

import { Link } from "react-router-dom";
import "./DonationCard.css";

function DonationCard({ fundraiserData, onDonateClick, clickable }) {
  const { id, title, description, goal, pledges = [], is_open } = fundraiserData;

  // Add up every pledge amount to get the total raised so far
  const totalRaised = pledges.reduce((total, pledge) => total + Number(pledge.amount), 0);

  // The inside of the card - the same for both versions
  const cardContent = (
    <>
      {fundraiserData.image && (
        <img src={fundraiserData.image} alt={title} />
      )}

      <h3>{title}</h3>

      {description && <p>{description}</p>}

      <p><strong>${totalRaised}</strong> raised of ${Number(goal)} goal</p>

      <p>{is_open ? "Open for donations" : "Closed"}</p>
    </>
  );

  // List page: the whole card is a link to the fundraiser's own page
  if (clickable) {
    return (
      <Link to={`/fundraiser/${id}`} className="donation-card donation-card-link">
        {cardContent}
      </Link>
    );
  }

  // Fundraiser page: show the card with a Donate button
  return (
    <div className="donation-card">
      {cardContent}

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

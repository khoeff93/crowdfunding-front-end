// FundraiserPage
// Shows ONE fundraiser on its own page.
// You get here by clicking a fundraiser's title, which links to /fundraiser/:id.
// Clicking Donate opens a donation form right below the card (no login needed).

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser.js";
import DonationCard from "../components/DonationCard.jsx";
import DonationForm from "../components/DonationForm.jsx";
import "./FundraiserPage.css";

function FundraiserPage() {
  // Grab the id from the web address (e.g. /fundraiser/3 gives id = "3")
  const { id } = useParams();

  // Use our hook to fetch just this one fundraiser from the back end.
  // refetch lets us reload it after a donation so the total updates.
  const { fundraiser, isLoading, error, refetch } = useFundraiser(id);

  // Controls whether the donation form is showing, and the thank-you message
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Show the donation form below the card
  const handleDonateClick = () => {
    setShowForm(true);
    setSuccessMessage(null);
  };

  // After a donation saves: hide the form, say thanks, and reload the total
  const handlePledgeSuccess = (amount) => {
    setShowForm(false);
    setSuccessMessage(`Thank you! Your donation of $${amount} has been received.`);
    refetch();
  };

  // While we wait for the data to come back
  if (isLoading) {
    return <p>Loading fundraiser...</p>;
  }

  // If something went wrong fetching the fundraiser
  if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>;
  }

  return (
    <main className="fundraiser-page">

      {/* Link back to the full list of fundraisers */}
      <Link to="/donation">&larr; Back to all fundraisers</Link>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      {/* Reuse the same card as the Donation page so it looks consistent */}
      <DonationCard
        fundraiserData={fundraiser}
        onDonateClick={handleDonateClick}
      />

      {/* The donation form appears below the card once Donate is clicked */}
      {showForm && (
        <DonationForm
          fundraiser={fundraiser}
          onSuccess={handlePledgeSuccess}
        />
      )}

    </main>
  );
}

export default FundraiserPage;

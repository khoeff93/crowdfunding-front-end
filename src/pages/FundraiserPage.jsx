// FundraiserPage
// Shows ONE fundraiser on its own page.
// You get here by clicking a fundraiser's title, which links to /fundraiser/:id.

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser.js";
import DonationCard from "../components/DonationCard.jsx";
import PledgeModal from "../components/PledgeModal.jsx";
import "./FundraiserPage.css";

function FundraiserPage() {
  // Grab the id from the web address (e.g. /fundraiser/3 gives id = "3")
  const { id } = useParams();

  // Use our hook to fetch just this one fundraiser from the back end
  const { fundraiser, isLoading, error } = useFundraiser(id);

  // Controls whether the donate pop-up is open, and the thank-you message
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Open the donate pop-up
  const handleDonateClick = () => {
    setShowModal(true);
    setSuccessMessage(null);
  };

  // After a donation works: close the pop-up and say thanks
  const handlePledgeSuccess = (amount) => {
    setShowModal(false);
    setSuccessMessage(`Thank you! Your donation of $${amount} has been received.`);
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

      {/* Only show the pop-up when the user has clicked Donate */}
      {showModal && (
        <PledgeModal
          fundraiser={fundraiser}
          onClose={() => setShowModal(false)}
          onSuccess={handlePledgeSuccess}
        />
      )}

    </main>
  );
}

export default FundraiserPage;

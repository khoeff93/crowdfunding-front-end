// DonationPage
// Shows ALL fundraisers in a grid so people can browse and donate.
// The card and the donate pop-up now live in their own component files.

import { useState, useEffect } from "react";
import DonationCard from "../components/DonationCard.jsx";
import PledgeModal from "../components/PledgeModal.jsx";
import "./DonationPage.css";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function DonationPage() {
  const [fundraisers, setFundraisers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Which fundraiser's donate pop-up is open (null means none)
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Get the list of all fundraisers from the back end
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

  // Run getFundraisers once when the page first loads
  useEffect(() => {
    getFundraisers();
  }, []);

  // Filter the list by what the user typed in the search box
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    const query = searchQuery.toLowerCase();
    return (
      fundraiser.title.toLowerCase().includes(query) ||
      (fundraiser.description ?? "").toLowerCase().includes(query)
    );
  });

  // Open the donate pop-up for the chosen fundraiser
  const handleDonateClick = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setSuccessMessage(null);
  };

  // After a donation works: close the pop-up, say thanks, and refresh the list
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

      {/* The grid of fundraiser cards */}
      <div className="donation-page-grid">
        {filteredFundraisers.map((fundraiser) => (
          <DonationCard
            key={fundraiser.id}
            fundraiserData={fundraiser}
            onDonateClick={handleDonateClick}
          />
        ))}
      </div>

      {/* Only show the pop-up when a fundraiser has been selected */}
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

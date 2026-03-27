import { useState, useEffect } from "react";
import getFundraiser from "../api/get-fundraiser";
import FundraiserCard from "./FundraiserCard";

function FundraiserLeaderboard({ fundraisers }) {
  const [fullFundraisers, setFullFundraisers] = useState([]);

  useEffect(() => {
    Promise.all(fundraisers.map((f) => getFundraiser(f.id)))
      .then((data) => setFullFundraisers(data));
  }, [fundraisers]);

  const sorted = fullFundraisers
    .map((fundraiser) => {
      const total = (fundraiser.pledges || []).reduce((sum, pledge) => sum + pledge.amount, 0);
      return { ...fundraiser, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return (
    <div>
      <h2>Leaderboard</h2>
      {sorted.map((fundraiser, index) => (
        <div key={fundraiser.id}>
          <p>#{index + 1} - ${fundraiser.total} raised</p>
          <FundraiserCard fundraiserData={fundraiser} />
        </div>
      ))}
    </div>
  );
}

export default FundraiserLeaderboard;
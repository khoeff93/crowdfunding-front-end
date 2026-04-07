import FundraiserCard from "./FundraiserCard";

function FundraiserLeaderboard({ fundraisers }) {
  const sorted = fundraisers
    .map((fundraiser) => {
      const total = (fundraiser.pledges || []).reduce((sum, pledge) => sum + pledge.amount, 0);
      return { ...fundraiser, total };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10); // ← this shows the quantity wanting to be shown

  return (
    <div>
      <h2>Leaderboard</h2>
      <div className="leaderboard-grid"> {/* ← wrap in grid div */}
        {sorted.map((fundraiser, index) => (
          <div key={fundraiser.id}>
            <p>#{index + 1} - ${fundraiser.total} raised</p>
            <FundraiserCard fundraiserData={fundraiser} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FundraiserLeaderboard;
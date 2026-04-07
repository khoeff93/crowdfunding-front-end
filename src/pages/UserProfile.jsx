import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import FundraiserCard from "../components/FundraiserCard.jsx";
import "./UserProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

function UserProfile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [fundraisers, setFundraisers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
    is_open: true,
  });

  // If not logged in, send to login page
  if (!auth.token) {
    navigate("/login");
    return null;
  }

  // Load all fundraisers belonging to this user when the page opens
  useEffect(() => {
    fetch(`${API_URL}/fundraisers/`, {
      headers: { Authorization: `Token ${auth.token}` },
    })
      .then((res) => res.json())
      .then((allFundraisers) => {
        // Filter to only this user's fundraisers
        const mine = allFundraisers.filter((f) => f.owner === Number(auth.userId));
        setFundraisers(mine);
      });
  }, []);

  // Delete the user's account
  const handleDeleteAccount = () => {
    fetch(`${API_URL}/users/${auth.userId}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${auth.token}` },
    }).then(() => {
      window.localStorage.clear();
      setAuth({ token: null, userId: null, username: null, email: null });
      navigate("/");
    });
  };

  // Delete a fundraiser
  const handleDeleteFundraiser = (fundraiser) => {
    fetch(`${API_URL}/fundraisers/${fundraiser.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${auth.token}` },
    }).then(() => {
      // Remove it from the list
      setFundraisers((prev) => prev.filter((f) => f.id !== fundraiser.id));
    });
  };

  // Open the edit modal for a specific fundraiser
  const handleEditClick = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setUpdateForm({
      title: fundraiser.title,
      description: fundraiser.description,
      goal: fundraiser.goal,
      image: fundraiser.image,
      is_open: fundraiser.is_open,
    });
    setShowUpdateModal(true);
  };

  // Save the updated fundraiser
  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/fundraisers/${selectedFundraiser.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${auth.token}`,
      },
      body: JSON.stringify(updateForm),
    })
      .then((res) => res.json())
      .then((updated) => {
        // Replace the old fundraiser in the list with the updated one
        setFundraisers((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f))
        );
        setShowUpdateModal(false);
      });
  };

  return (
    <main className="profile-main">

      {/* Profile details */}
      <section className="about-section profile-header">
        <div className="profile-avatar">{auth.username?.[0]?.toUpperCase()}</div>
        <h2>{auth.username}</h2>
        <p>{auth.email}</p>
        <button
          className="profile-btn profile-btn--danger"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </section>

      {/* Fundraiser section */}
      <section className="profile-fundraiser-section">
        <h3 className="profile-section-title">My Fundraisers</h3>

        {fundraisers.length === 0 && <p>You don't have any fundraisers yet.</p>}

        {/* Show a card + pledge panel for each fundraiser */}
        {fundraisers.map((fundraiser) => {
          const totalPledged = fundraiser.pledges?.reduce(
            (total, pledge) => total + Number(pledge.amount),
            0
          ) ?? 0;

          return (
            <div key={fundraiser.id} className="profile-fundraiser-layout">

              {/* The fundraiser card */}
              <FundraiserCard fundraiserData={fundraiser} />

              {/* Pledge info and action buttons */}
              <div className="profile-pledge-panel">
                <p className="pledge-raised">${totalPledged.toLocaleString()}</p>
                <p className="pledge-goal-label">
                  raised of ${Number(fundraiser.goal).toLocaleString()} goal
                </p>

                {/* Progress bar */}
                <div className="pledge-track">
                  <div
                    className="pledge-fill"
                    style={{
                      width: `${Math.min((totalPledged / fundraiser.goal) * 100, 100)}%`,
                    }}
                  />
                </div>

                {/* Individual pledges */}
                {fundraiser.pledges?.length > 0 && (
                  <ul className="pledge-list">
                    {fundraiser.pledges.map((pledge) => (
                      <li key={pledge.id} className="pledge-item">
                        <span>
                          {pledge.anonymous ? "Anonymous" : `Supporter #${pledge.supporter}`}
                        </span>
                        <span>${Number(pledge.amount).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="profile-actions">
                  <button
                    className="profile-btn profile-btn--primary"
                    onClick={() => handleEditClick(fundraiser)}
                  >
                    Edit Fundraiser
                  </button>
                  <button
                    className="profile-btn profile-btn--danger"
                    onClick={() => handleDeleteFundraiser(fundraiser)}
                  >
                    Delete Fundraiser
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Edit fundraiser modal */}
      {showUpdateModal && (
        <div className="profile-overlay">
          <div className="profile-modal">
            <h3>Edit Fundraiser</h3>
            <form className="modal-form" onSubmit={handleUpdateSubmit}>
              <label>Title</label>
              <input
                type="text"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
              />

              <label>Description</label>
              <textarea
                rows={4}
                value={updateForm.description}
                onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
              />

              <label>Goal ($)</label>
              <input
                type="number"
                value={updateForm.goal}
                onChange={(e) => setUpdateForm({ ...updateForm, goal: e.target.value })}
              />

              <label>Image URL</label>
              <input
                type="text"
                value={updateForm.image}
                onChange={(e) => setUpdateForm({ ...updateForm, image: e.target.value })}
              />

              <label>
                <input
                  type="checkbox"
                  checked={updateForm.is_open}
                  onChange={(e) => setUpdateForm({ ...updateForm, is_open: e.target.checked })}
                />
                {" "}Fundraiser is open
              </label>

              <div className="modal-actions">
                <button type="submit" className="profile-btn profile-btn--primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn--ghost"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

export default UserProfile;
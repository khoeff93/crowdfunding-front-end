import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import postCreateFundraiser from "../api/post-create-fundraiser";

function CreateFundraiserForm() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [fundraiser, setFundraiser] = useState({
        title: "",
        description: "",
        goal: "",
        image: "",
        is_open: true,
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        setFundraiser((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (fundraiser.title && fundraiser.description && fundraiser.goal) {
            try {
                await postCreateFundraiser(
                    fundraiser.title,
                    fundraiser.description,
                    parseFloat(fundraiser.goal),
                    fundraiser.image,
                    fundraiser.is_open,
                    auth.token
                );
                navigate("/");
            } catch (err) {
                console.error("Failed to create fundraiser:", err);
                setError(err.message || "Something went wrong.");
            }
        } else {
            setError("Please fill in all required fields.");
        }
    };

    return (
        <form className="create-fundraiser-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    placeholder="Your fundraiser title"
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder="Your description"
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="goal">Goal ($)</label>
                <input
                    type="number"
                    id="goal"
                    placeholder="Your goal amount"
                    min="1"
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="image">Image URL</label>
                <input
                    type="url"
                    id="image"
                    placeholder="https://via.placeholder.com/300/jpg"
                    onChange={handleChange}
                />
            </div>

            <div className="form-field">
                <label htmlFor="is_open">
                    <input
                        type="checkbox"
                        id="is_open"
                        checked={fundraiser.is_open}
                        onChange={handleChange}
                    />
                    {" "}Open for donations
                </label>
            </div>

            {error && <p>{error}</p>}

            <button type="submit">Create Fundraiser</button>
        </form>
    );
}

export default CreateFundraiserForm;
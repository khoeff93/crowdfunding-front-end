import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import postSignUp from "../api/post-signup";

function SignUpForm() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { id, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        if (credentials.username && credentials.email && credentials.password) {
            postSignUp(
                credentials.username,
                credentials.email,
                credentials.password
            ).then(() => {
                navigate("/login");
            }).catch((err) => {
                setError(err.message || "Something went wrong. Please try again.");
            });
        } else {
            setError("Please fill in all fields.");
        }
    };

    return (
        <form>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Enter username" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" placeholder="Enter email" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="Enter password" onChange={handleChange} />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!auth.token && (
                <button type="submit" onClick={handleSubmit}>
                    Sign Up
                </button>
            )}
        </form>
    );
}

export default SignUpForm;
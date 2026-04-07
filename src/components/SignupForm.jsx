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

    const handleChange = (event) => {
        const { id, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (credentials.username && credentials.email && credentials.password) {
            postSignUp(
                credentials.username,
                credentials.email,
                credentials.password
            ).then(() => {
                navigate("/login");
            });
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

            {!auth.token && (
                <button type="submit" onClick={handleSubmit}>
                    Sign Up
                </button>
            )}
        </form>
    );
}

export default SignUpForm;
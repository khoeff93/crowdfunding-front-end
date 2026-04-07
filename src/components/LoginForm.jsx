import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postLogin from "../api/post-login";
import useAuth from "../hooks/use-auth.js";

const API_URL = import.meta.env.VITE_API_URL;

function LoginForm() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Step 1: log in and get the token
    const response = await postLogin(credentials.username, credentials.password);
    const token = response.token;

    // Step 2: fetch the user list to find this user's id and email
    const usersResponse = await fetch(`${API_URL}/users/`, {
      headers: { Authorization: `Token ${token}` },
    });
   const users = await usersResponse.json();
    console.log("users response:", users);         // 👈 add this
    const currentUser = users.find((u) => u.username === credentials.username);
    console.log("current user found:", currentUser); // 👈 and this

    // Step 3: save everything to localStorage so it survives a page refresh
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("userId", currentUser.id);
    window.localStorage.setItem("username", currentUser.username);
    window.localStorage.setItem("email", currentUser.email);

    // Step 4: save to auth context so the rest of the app can use it
    setAuth({
      token: token,
      userId: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
    });

    navigate("/");
  };

  return (
    <form>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;

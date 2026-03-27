import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import our pages
import FundraiserPage from "./pages/FundraiserPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

// Import our components
import NavBar from "./components/NavBar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {path: "/", element: <HomePage /> },
      // {path: "/fundraiser", element: <FundraiserPage />},
      { path: "/login", element: <LoginPage />},
      { path: "/signup", element: <SignupPage />},
      { path: "/fundraiser/:id", element: <FundraiserPage /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
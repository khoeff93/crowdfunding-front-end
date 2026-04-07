import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import FundraiserPage from "./pages/FundraiserPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CreateFundraiserPage from "./pages/CreateFundraiserPage.jsx";
import DonationPage from "./pages/DonationPage.jsx";
import UserProfile from "./pages/UserProfile.jsx";

import NavBar from "./components/NavBar.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
      { path: "/donation", element: <DonationPage /> },
      { path: "/create-fundraiser", element: <CreateFundraiserPage /> },
      { path: "/profile", element: <UserProfile /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

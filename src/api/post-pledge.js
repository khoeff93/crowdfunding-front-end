// post-pledge.js
// Sends a donation (pledge) to the backend API.
// A token is optional: if it's provided we tell the backend who is logged in,
// but people can also donate without logging in (an anonymous donation).

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function postPledge(pledgeData, token) {
  // Always send JSON
  const headers = {
    "Content-Type": "application/json",
  };

  // Only add the login token if we actually have one
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${baseUrl}/pledges/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(pledgeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.detail ?? `Something went wrong (${response.status})`);
  }

  return response.json();
}

export default postPledge;

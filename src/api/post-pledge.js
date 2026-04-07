// post-pledge.js
// Sends a donation (pledge) to the backend API.
// The user must be logged in — the token proves who they are.

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function postPledge(pledgeData, token) {
  const response = await fetch(`${baseUrl}/pledges/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // This is how we tell the backend who is logged in
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify(pledgeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.detail ?? `Something went wrong (${response.status})`);
  }

  return response.json();
}

export default postPledge;
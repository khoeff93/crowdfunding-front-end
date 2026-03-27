async function postSignUp(username, email, password) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;

    const data = JSON.stringify({
        "username": username,
        "email": email,
        "password": password,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
    });

    if (!response.ok) {
        const fallbackError = `Error trying to Sign Up`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postSignUp;

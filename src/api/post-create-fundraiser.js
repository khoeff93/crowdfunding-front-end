async function postCreateFundraiser(title, description, goal, image, is_open, token) {
    const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;

    const data = JSON.stringify({
        title,
        description,
        goal,
        image,
        is_open,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: data,
    });

    if (!response.ok) {
        const fallbackError = `Error trying to create fundraiser`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postCreateFundraiser;

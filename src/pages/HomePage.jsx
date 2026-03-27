import useFundraisers from "../hooks/use-fundraisers";
import FundraiserLeaderboard from "../components/FundraiserLeaderboard";
import ContactForm from "../components/ContactForm";

import "./HomePage.css";

function HomePage() {
    const { fundraisers, isLoading, error } = useFundraisers();

    if (isLoading) {
        return <p>loading...</p>;
    }

    if (error) {
        return <p>{error.message}</p>;
    }

    return (
        <div id="fundraiser-list">
            <FundraiserLeaderboard fundraisers={fundraisers} />
            <ContactForm />
        </div>
    );
}

export default HomePage;
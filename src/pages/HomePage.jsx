import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers";
import useSpinner from "../hooks/use-spinner";
import getFundraiser from "../api/get-fundraiser";
import FundraiserLeaderboard from "../components/FundraiserLeaderboard";
import ContactForm from "../components/ContactForm";
import BannerCollage from "../components/BannerCollage";
import LoadingSpinner from "../components/LoadingSpinner";
import "./HomePage.css";

function HomePage() {
    const { fundraisers, isLoading, error } = useFundraisers();
    const [fullFundraisers, setFullFundraisers] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);
    const { hash } = useLocation();

    // Controls the loading spinner (shows for at least 2s, then fades out).
    // The home page isn't ready until BOTH the list and the leaderboard load.
    const { showSpinner, fadeOut } = useSpinner(isLoading || leaderboardLoading);

    useEffect(() => {
        if (!isLoading && fundraisers.length > 0) {
            setLeaderboardLoading(true);
            Promise.all(fundraisers.map((f) => getFundraiser(f.id)))
                .then((data) => {
                    setFullFundraisers(data);
                    setLeaderboardLoading(false);
                });
        }
    }, [fundraisers, isLoading]);

    useEffect(() => {
        // Wait until the spinner is gone (so the content exists) before scrolling
        if (hash && !showSpinner) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    }, [hash, showSpinner]);

    if (showSpinner) {
        return <LoadingSpinner fadeOut={fadeOut} />;
    }

    if (error) {
        return <p>{error.message}</p>;
    }

    return (
        <div id="fundraiser-list">
            {/* Small photo banner at the very top of the page */}
            <BannerCollage />
            <section id="about" className="about-section">
                <h2>About Us</h2>
                <p>Real change means giving up the things that actually matter to you - the habits and comforts that quietly cost the Earth. Not the easy stuff. The stuff you'll actually miss.</p>
                <p>That's what Uncomfortably Green is about. We're a charity that believes the most powerful thing you can do for the planet is notice what you're not willing to change and then change it anyway.</p>
                <p>Pick your thing. Choose the timeline. Give it up. Be a bit uncomfortable. Because that's what actually trying feels like.</p>
                <p>Every penny we raise goes directly towards protecting and restoring the planet's natural resources - for the people, animals, and ecosystems that depend on them.</p>
            </section>
            <FundraiserLeaderboard fundraisers={fullFundraisers} />
            <ContactForm />
        </div>
    );
}

export default HomePage;
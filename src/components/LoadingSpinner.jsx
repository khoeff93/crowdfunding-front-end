// LoadingSpinner
// A rotating spinner image shown while a page is loading.
// It sits on the normal page background (no dark overlay).
// The fadeOut prop makes it gently fade away once loading is finished.

import spinner from "../assets/loading_spinner.png";
import "./LoadingSpinner.css";

function LoadingSpinner({ fadeOut }) {
  return (
    <div className={fadeOut ? "loading-spinner fade-out" : "loading-spinner"}>
      <img src={spinner} alt="Loading..." className="spinner-image" />
    </div>
  );
}

export default LoadingSpinner;

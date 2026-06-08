import { useState, useEffect } from "react";

// useSpinner
// Controls the loading spinner so it ALWAYS shows for at least 2 seconds
// (2000ms = 2 secs), then fades out once the page has finished loading.
// You pass in isLoading and get back:
//   showSpinner - whether the spinner should still be on screen
//   fadeOut     - whether the spinner has started fading away
export default function useSpinner(isLoading) {
  // Has the minimum 2 seconds passed yet?
  const [minTimePassed, setMinTimePassed] = useState(false);
  // Should the spinner still be shown at all?
  const [showSpinner, setShowSpinner] = useState(true);
  // Has the fade-out started?
  const [fadeOut, setFadeOut] = useState(false);

  // Start a 2 second timer as soon as the spinner first appears
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Once loading is done AND the 2 seconds have passed: fade out, then hide
  useEffect(() => {
    if (!isLoading && minTimePassed) {
      setFadeOut(true);
      // Wait for the fade (0.5s) to finish before removing the spinner
      const timer = setTimeout(() => setShowSpinner(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minTimePassed]);

  return { showSpinner, fadeOut };
}

import { useState, useEffect } from "react";

import getFundraiser from "../api/get-fundraiser";

export default function useFundraiser(fundraiserId) {
  const [fundraiser, setFundraiser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  // Pull this one fundraiser from the back end.
  // We keep it in its own function so we can call it again later
  // (for example, to refresh the total after someone donates).
  const loadFundraiser = () => {
    getFundraiser(fundraiserId)
      .then((fundraiser) => {
        setFundraiser(fundraiser);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadFundraiser();

    // Re-run if the fundraiserId changes.
  }, [fundraiserId]);

  // refetch lets the page reload the fundraiser on demand.
  return { fundraiser, isLoading, error, refetch: loadFundraiser };
}

import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (
      apiCall,
      {
        onSuccess,
        onError,
        successMessage,
        errorMessage = "An error occurred. Please try again.",
      } = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(response);
        }

        return response;
      } catch (err) {
        const errorMsg = err.response?.data?.message || errorMessage;
        setError(errorMsg);

        if (errorMessage && errorMsg) {
          toast.error(errorMsg);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}

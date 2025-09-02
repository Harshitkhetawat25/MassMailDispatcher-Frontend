import { useEffect, useState } from "react";
import { API_URL } from "../../constants/config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useApiCall } from "./useApiCall";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const loading = useSelector((state) => state.user.loading);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const { execute } = useApiCall();

  // Function to fetch user data from backend
  const refetchUser = () => {
    dispatch(setLoading(true));
    execute(
      () =>
        axios.get(`${API_URL}/api/user/getcurrentuser`, {
          withCredentials: true,
        }),
      {
        onSuccess: (response) => {
          dispatch(setUserData(response.data));
        },
        onError: (err) => {
          // Silently handle user not found/not verified cases
          if (err.response?.status === 403 || err.response?.status === 401) {
            // User not authenticated or email not verified - this is expected
          } else {
            console.log("Error fetching user:", err.response?.data?.message);
          }
          dispatch(setUserData(null));
        },
        errorMessage: null,
      }
    ).finally(() => {
      dispatch(setLoading(false));
    });
  };

  useEffect(() => {
    // Only fetch if we don't already have user data and haven't already tried to fetch
    if (user === undefined && !fetchedOnce) {
      setFetchedOnce(true);
      refetchUser();
    }
  }, [dispatch, user, fetchedOnce, execute]);

  return { user, loading, refetchUser };
}

export default useGetCurrentUser;

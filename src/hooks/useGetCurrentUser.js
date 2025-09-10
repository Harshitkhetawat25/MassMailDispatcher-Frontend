import { useEffect, useState } from "react";
import { API_URL } from "../../constants/config";
import api from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const loading = useSelector((state) => state.user.loading);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Function to fetch user data from backend
  const refetchUser = async () => {
    if (loading) return; // Prevent multiple simultaneous calls

    dispatch(setLoading(true));
    try {
      const response = await api.get("/api/user/getcurrentuser");
      dispatch(setUserData(response.data));
    } catch (err) {
      // Silently handle user not found/not verified cases
      if (err.response?.status === 403 || err.response?.status === 401) {
        // User not authenticated or email not verified - this is expected
        console.log("User not authenticated:", err.response?.data?.message);
      } else {
        console.log("Error fetching user:", err.response?.data?.message);
      }
      dispatch(setUserData(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    // Only fetch if we don't already have user data and haven't already tried to fetch
    if (user === undefined && !fetchedOnce && !loading) {
      setFetchedOnce(true);
      refetchUser();
    }
  }, [user, fetchedOnce, loading]);

  return { user, loading, refetchUser };
}

export default useGetCurrentUser;

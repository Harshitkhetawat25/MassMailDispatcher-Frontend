import { useEffect } from "react";
import { API_URL } from "../../constants/config";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(API_URL + "/api/user/getCurrentUser", {
          withCredentials: true,
        });
        console.log(response);
        dispatch(setUserData(response.data));
      } catch (err) {
        console.log(err.response.data.message);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;

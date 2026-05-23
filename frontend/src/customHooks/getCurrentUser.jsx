import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthChecked, setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

export default function GetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
          signal: controller.signal,
        });

        dispatch(setUserData(result.data));
      } catch (error) {
        if (controller.signal.aborted) return;
        // If cookie is missing/expired, ensure state is cleared (prevents stale sessions).
        dispatch(setUserData(null));
        console.log("Fetch Current User Error:", error);
      } finally {
        if (!controller.signal.aborted) dispatch(setAuthChecked(true));
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [dispatch]);

  return null;
}
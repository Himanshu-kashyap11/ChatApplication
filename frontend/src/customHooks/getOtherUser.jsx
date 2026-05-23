import { useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { serverUrl } from "../main";

const getId = (val) => {
  if (!val) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val._id === "string") return val._id;
  return null;
};

export default function GetOtherUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const myUserId = useMemo(() => getId(userData), [userData]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOtherUsers = async () => {
      try {
        if (!myUserId) {
          dispatch(setOtherUsers([]));
          return;
        }

        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
          signal: controller.signal,
        });

        const list = Array.isArray(result.data) ? result.data : [];
        const filtered = list.filter((u) => getId(u) !== myUserId);
        dispatch(setOtherUsers(filtered));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.log("Fetch Other Users Error:", error);
      }
    };

    fetchOtherUsers();
    return () => controller.abort();
  }, [myUserId, dispatch]);

  return null;
}
import React, { useState, useRef } from "react";
import dp from "../assets/dp.jpg";
import { FaCamera } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

const Profile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 z-20 p-2 rounded-full
        bg-white/60 dark:bg-gray-800/60 backdrop-blur hover:bg-white dark:hover:bg-gray-700 transition"
      >
        <IoMdArrowRoundBack className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      </button>

      {/* Glass Card */}
      <div
        className="relative z-10 w-full max-w-[900px] rounded-3xl p-8 md:p-12
        bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-lg transition-colors duration-300"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-10">
          Profile Settings
        </h2>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Avatar */}
          <div
            className="md:w-[35%] flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => image.current.click()}
          >
            <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border shadow-md group">
              <img
                src={frontendImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <FaCamera className="text-white text-xl" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Change profile photo</p>
          </div>

          {/* Form */}
          <form
            className="md:w-[65%] grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={handleProfile}
          >
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 dark:text-gray-200 border dark:border-gray-600"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Username</label>
              <input
                type="text"
                value={userData?.userName || ""}
                readOnly
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-700/70 dark:text-gray-200 border dark:border-gray-600"
              />
            </div>

            {/* Save Button */}
            <div className="sm:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-xl font-medium text-white
                flex items-center gap-2 transition
                ${
                  saving
                    ? "bg-sky-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600"
                }`}
              >
                {saving && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      navigate("/")
      setEmail("");
      setPassword("");
      setLoading(false);
      setErr("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="
        w-full min-h-screen
        bg-gradient-to-br from-[#e6f7ff] via-[#f5fcff] to-white
        flex flex-col md:flex-row
        items-start md:items-center
        justify-start md:justify-between
        px-4 sm:px-8 md:px-[120px]
        py-10 gap-12 overflow-y-auto
      "
    >
      {/* Image Section */}
      <div className="w-full md:w-[55%] flex justify-center items-center">
        <img
          src="/4d.png"
          alt="signup"
          className="
            w-full max-w-[300px] sm:max-w-[380px] md:max-w-[460px]
            drop-shadow-xl rounded-2xl
            transition-transform duration-300
            hover:scale-[1.03]
          "
        />
      </div>

      {/* Signup Card */}
      <div
        className="
          w-full max-w-[420px] md:max-w-[500px]
          bg-white/90 backdrop-blur-xl
          rounded-3xl shadow-2xl
          flex flex-col gap-8
          mx-auto
          transition-all duration-300
          hover:shadow-[0_20px_40px_rgba(32,199,255,0.25)]
        "
      >
        {/* Header */}
        <div
          className="
            w-full h-[150px] md:h-[190px]
            bg-gradient-to-r from-[#20c7ff] via-[#3fd2ff] to-[#6adfff]
            rounded-t-3xl rounded-b-[45%]
            shadow-lg
            flex justify-center items-center
          "
        >
          <h1 className="text-gray-700 font-semibold text-[22px] md:text-[30px] tracking-wide">
            Login to <span className="text-white font-bold">SayHi</span>
          </h1>
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 items-center px-4 pb-8"
          onSubmit={handleLogin}
        >
          {/* Email */}
          <input
            type="email"
            placeholder="Enter the Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="
              w-[90%] h-[46px] md:h-[50px]
              px-4 rounded-xl
              border border-[#20c7ff]/60
              bg-white shadow-sm
              text-gray-700 text-[15px] md:text-[17px]
              placeholder-gray-400
              outline-none
              focus:ring-2 focus:ring-[#20c7ff]
              focus:border-transparent
              transition-all
            "
          />

          {/* Password */}
          <div className="w-[90%] relative">
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="Enter the Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="
                w-full h-[46px] md:h-[50px]
                px-4 pr-12 rounded-xl
                border border-[#20c7ff]/60
                bg-white shadow-sm
                text-gray-700 text-[15px] md:text-[17px]
                placeholder-gray-400
                outline-none
                focus:ring-2 focus:ring-[#20c7ff]
                focus:border-transparent
                transition-all
              "
            />
            <span
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                text-sm text-[#20c7ff] font-medium
                cursor-pointer select-none
                hover:underline
              "
              onClick={() => setShow((prev) => !prev)}
            >
              {`${show ? "hidden" : "show"}`}
            </span>
          </div>

          {err && <p className="text-red-500">{"*" + err}</p>}

          {/* Button */}
          <button
            className="
              w-[180px] md:w-[200px]
              mt-4 py-2.5
              rounded-full
              bg-gradient-to-r from-[#20c7ff] to-[#3fd2ff]
              text-white font-semibold
              text-[17px] md:text-[19px]
              shadow-lg
              hover:opacity-90 hover:shadow-inner
              transition-all duration-300
            "
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Login Link */}
          <p
            className="cursor-pointer text-sm md:text-base text-gray-600"
            onClick={() => navigate("/signup")}
          >
            Want to create a new account ?
            <span className="text-blue-500 font-semibold ml-1 hover:underline">
              SignUp
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
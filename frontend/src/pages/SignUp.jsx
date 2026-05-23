import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ frontend validation
    if (!userName || !email || !password) {
      alert("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data))
      navigate("/profile")

      // ✅ clear form
      setUserName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      setErr("");
    } catch (error) {
      // ✅ show real backend error
      console.log(error.response?.data || error.message);
      setLoading(false);
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#e6f7ff] via-[#f5fcff] to-white flex flex-col md:flex-row px-4 md:px-[120px] py-10 gap-12">
      <div className="w-full md:w-[55%] flex justify-center items-center">
        <img src="/3d.png" alt="signup" className="w-full max-w-[460px]" />
      </div>

      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl mx-auto rounded-t-[30%]">
        <div className="h-[180px] bg-gradient-to-r from-[#20c7ff] to-[#6adfff] rounded-b-[30%]  flex justify-center items-center">
          <h1 className="text-white text-2xl font-bold">Welcome to SayHi</h1>
        </div>

        <form
          className="flex flex-col gap-4 items-center p-6"
          onSubmit={handleSignUp}
        >
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-[90%] h-[48px] px-4 border rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[90%] h-[48px] px-4 border rounded-xl"
          />

          <div className="w-[90%] relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[48px] px-4 pr-12 border rounded-xl"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-blue-500"
              onClick={() => setShow(!show)}
            >
              {show ? "hide" : "show"}
            </span>
          </div>

          {err && <p className="text-red-500">{"*" + err}</p>}

          <button
            type="submit"
            className="w-[200px] py-2 rounded-full bg-blue-500 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>

          <p
            className="cursor-pointer text-gray-600"
            onClick={() => navigate("/login")}
          >
            Already have an account?{" "}
            <span className="text-blue-500">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
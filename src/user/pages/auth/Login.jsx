import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Api from "../../../utils/Api";
import { setItem } from "../../../utils/localStorageUpdater";
import { setUserInfo } from "../../../redux/features/user/userSlice";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await Api.post(import.meta.env.VITE_LOGIN, formData);
      console.log("Res response", res.data);
      const user = { name: res.data.user.name, email: res.data.user.email , role:res.data.user.role };
      console.log("role1 : ",res)
      setItem("token", res.data.token);
      
      dispatch(setUserInfo(user));
      setMsg("User logged in successfully!");
      setTimeout(() => setMsg(""), 8000);
      navigate("/"); // Redirect on success
    } catch (error) {
      console.error("Login Error:", error);

      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.response?.data) {
        setError(error?.response?.data?.msg || "Server side error try again");
      } else {
        setError("Failed to log in. Please try again later.");
      }
      console.log(error)
      setTimeout(() => setError(""), 8000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-[var(--accent-border)]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--accent-color)]">
          Login
        </h2>

        {msg && <p className="text-green-400 text-sm text-center mb-3">{msg}</p>}
        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
              required
            />
          </div>



          <button
            type="submit"
            className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] py-2 rounded-lg transition font-semibold"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
  <p className="text-gray-400">
    Don’t have an account?{" "}
    <Link
      to="/signup"
      className="text-[var(--accent-color)] hover:underline"
    >
      Sign up
    </Link>
  </p>

  <Link
    to="/forgetPassword"
    className="text-[var(--accent-color)] hover:underline"
  >
    Forgot Password?
  </Link>
</div>

      </div>
    </div>
  );
}

export default Login;

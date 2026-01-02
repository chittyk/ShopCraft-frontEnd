  
import React, { useState } from "react";
import {  Link } from "react-router-dom";
import VerifyOtp from "../../components/VerifyOtp/VerifyOtp";
import Api from "../../utils/Api";
const SignupPage = () => {
//   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form -> send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await Api.post(
        import.meta.env.VITE_SIGNUP,
                        
        formData,
        // { timeout: 8000 } // 8 sec timeout
      );

      console.log("OTP Sent Response:", res.data);
      setIsOtpSent(true);
      setMsg("OTP has been sent to your email!");

      // Auto clear message after 8 seconds
      setTimeout(() => setMsg(""), 8000);
    } catch (err) {
      console.error("Signup Error:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (err.response?.data) {
        setError(`${err.response.data}`);
      } else {
        setError("Failed to send OTP. Please try again later.");
      }

      // Clear error after 8 seconds
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      {!isOtpSent && (
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-[var(--accent-border)]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[var(--accent-color)]">
            Create Account
          </h2>

          {/* Success Message */}
          {msg && <p className="text-green-400 text-sm text-center mb-3">{msg}</p>}

          {/* Error Message */}
          {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
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
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg transition font-semibold ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)]"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            {/* Spinner */}
            {loading && (
              <div className="flex justify-center mt-3">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            )}
          </form>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--accent-color)] hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      )}

      {/* OTP Verify Component */}
      {isOtpSent && (
        <VerifyOtp
          name={formData.name}
          email={formData.email}
          password={formData.password}
        />
      )}
    </div>
  );
};

export default SignupPage;

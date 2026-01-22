import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VerifyOtp from "../../components/VerifyOtp/VerifyOtp";
import Api from "../../../utils/Api";
const ForgetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1 → Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await Api.post(
        import.meta.env.VITE_FORGETPASSWORD ,
        formData,
        // { timeout: 8000 } // 8 sec timeout
      );


      console.log("OTP Sent Response:", res.data);
      setMsg("OTP has been sent to your email!");
      setIsOtpSent(true);

      setTimeout(() => setMsg(""), 8000); 
    } catch (err) {
      console.error("OTP Send Error:", err.response.data.msg);

      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (err.response?.data) {
        setError(`${err.response.data}`);
      } else {
        setError("Failed to send OTP. Please try again later.");
      }

      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Update Password
  const handleUpdatePassword = async () => {
    console.log("Updating password with data:", formData);
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      {!isOtpSent && (
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-[var(--accent-border)]">
          <h2 className="text-3xl font-bold text-center mb-6 text-[var(--accent-color)]">
            Forgot Password
          </h2>

          {msg && (
            <p className="text-green-400 text-sm text-center mb-3">{msg}</p>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSendOtp} className="space-y-4">
  {/* Email Field */}
  <div>
    <label className="block text-sm mb-1">Email Address</label>
    <input
      type="email"
      name="email"
      placeholder="Enter your registered email"
      value={formData.email}
      onChange={handleChange}
      disabled={loading}
      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
      required
    />
  </div>

  {/* New Password Field */}
  <div>
    <label className="block text-sm mb-1">New Password</label>
    <input
      type="password"
      name="password"
      placeholder="Enter your new password"
      value={formData.password}
      onChange={handleChange}
      disabled={loading}
      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
      required
    />
  </div>

  {/* Confirm Password Field */}
  <div>
    <label className="block text-sm mb-1">Confirm Password</label>
    <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm your new password"
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
</form>


          <p className="text-sm text-center text-gray-400 mt-4">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[var(--accent-color)] hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      )}

      {/* OTP Verify + Password Reset */}
      {isOtpSent && (
        <VerifyOtp
          email={formData.email}
          password={formData.password}
          onVerifySuccess={() => setIsOtpSent(false)}
          onPasswordSubmit={handleUpdatePassword}
        />
      )}
    </div>
  );
};

export default ForgetPassword;

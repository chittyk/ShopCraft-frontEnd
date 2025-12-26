import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/auth.js";
import Api from "../../utils/Api.js";
import { current } from "@reduxjs/toolkit";

function VerifyOtp({ name, email, password, onPasswordSubmit }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(180);
  const [resendActive, setResendActive] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Disable manual refresh
  useEffect(() => {
    console.log("name:", name, "email:", email, "password:", password);
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Auto clear messages after 8 seconds
  useEffect(() => {
    if (msg || error) {
      const timeout = setTimeout(() => {
        setMsg("");
        setError("");
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [msg, error]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setResendActive(true);
    }
  }, [timer]);

  // Format timer mm:ss
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle input change
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{1,6}$/.test(pasted)) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      if (newOtp.length === 6) handleVerify(pasted);
    }
  };

  // Verify OTP based on current pathname
  const handleVerify = async (enteredOtp) => {
    const currentPath = window.location.pathname;
    console.log("hello")
    console.log("entered otp :",enteredOtp)
    console.log(current)
    try {
      let response;
      console.log(current)

      if (currentPath === "/signup") {
        // SignUp OTP verification
        response = await Api.post(import.meta.env.VITE_VERIFYSIGNUP, {
          name,
          email,
          password,
          otp: enteredOtp.toString(),
        });

        saveToken(response.data.token);
        setMsg(response.data?.msg || "OTP Verified Successfully!");
        setError("");
        setTimeout(() => navigate("/"), 1000);

      } else if (currentPath === "/forgetPassword") {
        // ForgetPassword OTP verification
        response = await Api.put(import.meta.env.VITE_UPDATEPASSWORD, {
          email,
          password,
          otp: enteredOtp.toString(),
        });

        setMsg(response.data?.msg || "Password updated successfully!");
        setError("");
        if (onPasswordSubmit) onPasswordSubmit(); // call parent callback
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);

      const errMsg =
        err.response?.data?.msg ||
        err.response?.data ||
        "Verification failed! Please try again.";

      setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
      setMsg("");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      const currentPath = window.location.pathname;
      if (currentPath === "/SignUp") {
        await Api.post(import.meta.env.VITE_SIGNUP, { name, email, password });
      } else if (currentPath === "/forgetPassword") {
        await Api.put(import.meta.env.VITE_FORGETPASSWORD, { email , password });
      }

      setMsg("New OTP sent successfully!");
      setError("");
      setTimer(180);
      setResendActive(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setError("Failed to resend OTP. Try again later.");
      setMsg("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--accent-color)]">
          Verify OTP
        </h2>

        <p className="text-center text-gray-400 mb-4">
          OTP sent to <span className="text-[var(--accent-color)]">{email}</span>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-2xl rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[var(--accent-hover)] outline-none"
            />
          ))}
        </div>

        {/* Success/Error messages */}
        {msg && <p className="text-center mb-3 text-green-400 font-thin">{msg}</p>}
        {error && <p className="text-center mb-3 text-red-400 font-thin">{error}</p>}

        <button
          type="button"
          onClick={() => handleVerify(otp.join(""))}
          className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] py-2 rounded-lg transition font-semibold"
        >
          Verify
        </button>

        <div className="text-center mt-4 text-gray-400">
          {resendActive ? (
            <button
              onClick={handleResendOtp}
              className="text-[var(--accent-color)] hover:underline font-semibold"
            >
              Resend OTP
            </button>
          ) : (
            <p>
              Resend available in{" "}
              <span className="text-[var(--accent-color)]">{formatTime(timer)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;

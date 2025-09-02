import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/config";

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60); // 2 minutes

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_URL}/api/auth/resend-verification`, { email });
      setMessage("Verification email resent! Please check your inbox.");
      setTimer(120); // Reset timer
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
      <h2>Check your email</h2>
      <p>
        We have sent a verification link to your email address.
        <br />
        Please verify your email to activate your account.
      </p>
      <div style={{ margin: "24px 0" }}>
        <input
          type="email"
          placeholder="Enter your email to resend"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <Button
          onClick={handleResend}
          disabled={loading || !email || timer > 0}
          style={{ width: "100%" }}
        >
          {loading
            ? "Resending..."
            : timer > 0
            ? `Resend in ${timer}s`
            : "Resend Verification Email"}
        </Button>
        {message && <p style={{ marginTop: 8 }}>{message}</p>}
      </div>
      <Button onClick={() => navigate("/login")}>Back to Login</Button>
    </div>
  );
};

export default CheckEmail;

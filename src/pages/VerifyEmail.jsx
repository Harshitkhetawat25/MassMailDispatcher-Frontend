import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants/config";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token missing.");
      return;
    }
    axios
      .get(`${API_URL}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed. Try again."
        );
      });
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <h2>Email Verification</h2>
        {status === "pending" && <p>Verifying...</p>}
        {status !== "pending" && <p>{message}</p>}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        >
          <Button onClick={() => navigate("/login")}>Back to Login</Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

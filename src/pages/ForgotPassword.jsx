import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Please enter your email.");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      alert(res.data.message);

      navigate("/login");

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-3">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter your email address and we'll send you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn btn-outline w-full mt-3"
        >
          Back to Login
        </button>
      </form>

    </div>
  );
};

export default ForgotPassword;
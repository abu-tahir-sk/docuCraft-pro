import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      setLoading(true);

      const res = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Password Reset Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-[430px]"
      >

        <h2 className="text-3xl font-bold mb-2">
          Create New Password
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="input input-bordered w-full mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input input-bordered w-full mb-6"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Reset Password"}
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;
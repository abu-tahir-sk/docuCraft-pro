import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/verify-email", {
        email,
        otp,
      });

      alert(res.data.message);

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Verification Failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleVerify}
        className="bg-white shadow-xl rounded-xl p-8 w-[420px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">

          Verify Email

        </h2>

        <p className="mb-5 text-sm text-gray-500">
          OTP sent to
          <br />
          <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input input-bordered w-full mb-5"
        />

        <button className="btn btn-primary w-full">

          Verify OTP

        </button>

      </form>

    </div>
  );
};

export default VerifyEmail;
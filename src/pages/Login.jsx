import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {

     
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", form);

      alert(res.data.message);

      navigate("/verify-login-otp", {
        state: {
          email: form.email,
          rememberMe: form.rememberMe,
        },
      });

    } catch (err) {

      alert(
        err.response?.data?.message || "Login Failed"
      );

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-[420px]"
      >

        <h2 className="text-2xl font-bold mb-6">

          Login

        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full mb-4"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2 mb-5">

          <input
            type="checkbox"
            name="rememberMe"
            onChange={handleChange}
          />

          Remember Me

        </label>

        <button className="btn btn-primary w-full" type="submit">

          Login

        </button>

      </form>
<div className="flex justify-end mb-4">
  
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-blue-600 hover:underline text-sm"
  >
    Forgot Password?
  </button>

</div>
    </div>
  );

};

export default Login;
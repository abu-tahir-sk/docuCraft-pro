// import { useLocation, useNavigate } from "react-router-dom";

// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { useState, useEffect, useRef } from "react";

// const VerifyLoginOTP = () => {
//       const navigate = useNavigate();
//       const location = useLocation();
//       const { checkAuth } = useAuth();

//       const email = location.state?.email || "";
//       const rememberMe = location.state?.rememberMe || false;

//       const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//       const inputRefs = useRef([]);
//       const [timer, setTimer] = useState(30);
//       const [canResend, setCanResend] = useState(false);
//       useEffect(() => {
//             if (timer > 0) {
//                   const interval = setInterval(() => {
//                         setTimer((prev) => prev - 1);
//                   }, 1000);

//                   return () => clearInterval(interval);
//             } else {
//                   setCanResend(true);
//             }
//       }, [timer]);

//       const handleSubmit = async (e) => {
//             e.preventDefault();
//              const otpCode = otp.join("");

//             try {
//                   const res = await api.post(
//                         "/auth/verify-login-otp",
//                         {
//                               email,
//                               otp: otpCode,
//                               rememberMe,
//                         },
//                         {
//                               withCredentials: true,
//                         }
//                   );

//                   alert(res.data.message);

//                  await checkAuth();

// setTimeout(() => {
//   navigate("/dashboard");
// }, 300);

//                   navigate("/dashboard");

//             } catch (err) {
//                   alert(
//                         err.response?.data?.message || "OTP Verification Failed"
//                   );
//             }
//       };

//       const handleResendOTP = async () => {
//             try {
//                   const res = await api.post("/auth/resend-login-otp", {
//                         email,
//                   });

//                   alert(res.data.message);

//                   setTimer(30);
//                   setCanResend(false);

//             } catch (err) {
//                   alert(
//                         err.response?.data?.message ||
//                         "Failed to resend OTP"
//                   );
//             }
//       };
//       const handleOTPChange = (value, index) => {

//             if (!/^\d?$/.test(value)) return;

//             const newOtp = [...otp];

//             newOtp[index] = value;

//             setOtp(newOtp);

//             if (value && index < 5) {
//                   inputRefs.current[index + 1].focus();
//             }

//       };
//       const handleKeyDown = (e, index) => {

//             if (
//                   e.key === "Backspace" &&
//                   !otp[index] &&
//                   index > 0
//             ) {
//                   inputRefs.current[index - 1].focus();
//             }

//       };
//       const handlePaste = (e) => {

//             const paste = e.clipboardData
//                   .getData("text")
//                   .trim();

//             if (!/^\d{6}$/.test(paste)) return;

//             const digits = paste.split("");

//             setOtp(digits);

//             digits.forEach((digit, i) => {
//                   if (inputRefs.current[i]) {
//                         inputRefs.current[i].value = digit;
//                   }
//             });

//       };

//       return (
//             <div className="min-h-screen flex justify-center items-center bg-gray-100">

//                   <form
//                         onSubmit={handleSubmit}
//                         className="bg-white rounded-xl shadow-xl p-8 w-[420px]"
//                   >

//                         <h2 className="text-2xl font-bold mb-6">
//                               Verify Login OTP
//                         </h2>

//                         <p className="text-gray-500 mb-5">
//                               OTP sent to
//                               <br />
//                               <b>{email}</b>
//                         </p>

//                         <div
//                               className="flex justify-between gap-3 mb-6"
//                               onPaste={handlePaste}
//                         >
//                               {otp.map((digit, index) => (
//                                     <input
//                                           key={index}
//                                           ref={(el) => (inputRefs.current[index] = el)}
//                                           type="text"
//                                           maxLength={1}
//                                           value={digit}
//                                           onChange={(e) =>
//                                                 handleOTPChange(e.target.value, index)
//                                           }
//                                           onKeyDown={(e) =>
//                                                 handleKeyDown(e, index)
//                                           }
//                                           className="w-14 h-14 text-center text-2xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                               ))}
//                         </div>

//                         <button className="btn btn-primary w-full">
//                               Verify OTP
//                         </button>

//                   </form>
//                   <div className="mt-4 text-center">
//                         <button
//                               type="button"
//                               disabled={!canResend}
//                               onClick={handleResendOTP}
//                               className={`mt-4 w-full btn ${canResend
//                                     ? "btn-primary"
//                                     : "btn-disabled"
//                                     }`}
//                         >
//                               {canResend
//                                     ? "Resend OTP"
//                                     : `Resend OTP in ${timer}s`}
//                         </button>
//                   </div>
//             </div>
//       );
// };

// export default VerifyLoginOTP;
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";




import DashboardLayout from "../DashboardLayout/DashboardLayout";
import PdfPreviewArea from "../pages/PdfPreviewArea";

import PrivateRoute from "./PrivateRoute";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyLoginOTP from "../pages/VerifyLoginOTP";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export const router = createBrowserRouter([

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <PdfPreviewArea />,
      },
    ],
  },
    {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },

  {
    path: "/verify-login-otp",
    element: <VerifyLoginOTP />,
  },
  {
  path: "/forgot-password",
  element: <ForgotPassword />,
},
{
  path: "/reset-password/:token",
  element: <ResetPassword />,
}

]);
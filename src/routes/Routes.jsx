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
import DashboardHome from "../pages/DashboardHome";
import SavedDocuments from "../pages/SavedDocuments";
import Settings from "../pages/Settings";
import DocumentPage from "../pages/Documents/DocumentPage";
import DocumentEditor from "../components/DocumentEditor";
import ViewPdf from "../pages/ViewPdf";

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
        element: <DashboardHome />,
      },
      // {
      //   path: "documents",
      //   element: <DocumentPage />,
      // },
      {
        path: "invoice",
        element: <DocumentEditor key="invoice" docType="invoice" />,
      },
      {
        path: "quotation",
        element: <DocumentEditor key="quotation" docType="quotation" />,
      },
      {
        path: "agreement",
        element: <DocumentEditor key="agreement" docType="agreement" />,
      },

      {
        path: "saved-documents",
        element: <SavedDocuments />,
      },
      {
        path: "view-pdf/:id",
        element: <ViewPdf />,
      },
      {
        path: "edit-document/:id",
        element: <DocumentEditor />, 
      },


      // {
      //   path: "clients",
      //   element: <Clients />,
      // },
      // {
      //   path: "company",
      //   element: <Company />,
      // },
      {
        path: "settings",
        element: <Settings />,
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
  },



]);
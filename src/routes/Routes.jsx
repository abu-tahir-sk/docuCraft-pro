import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import PdfPreviewArea from "../pages/PdfPreviewArea"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "", 
        element: <PdfPreviewArea />
      }
    ]
  },
]);
/* existing imports */
import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import CreateTrip from "./create-trip";
import "./index.css";
import Header from "./components/ui/custom/Header";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google"
import Viewtrip from "./view-trip/[tripId]";
import Footer from "./components/ui/custom/Footer";
import MyTrips from "./my-trips";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/view-trip/:tripId",
    element:<Viewtrip/>
  },
  {
    path: "/my-trips",
    element: <MyTrips />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <Header/>
    <Toaster />
    <RouterProvider router={router} />

    </GoogleOAuthProvider>
    <Footer/>
  </React.StrictMode>
);

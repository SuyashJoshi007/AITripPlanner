/* existing imports */
import { Toaster } from "sonner";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import CreateTrip from "./create-trip";
import "./index.css";
import Header from "./components/ui/custom/Header";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Viewtrip from "./view-trip/[tripId]";
import Footer from "./components/ui/custom/Footer";
import MyTrips from "./my-trips";

/* Root layout: provides router context to Header/Footer/children */
function RootLayout() {
  return (
    <>
      <Header />
      <Toaster />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,   // <-- wrap all pages with the layout
    children: [
      { index: true, element: <App /> },                     // path: "/"
      { path: "create-trip", element: <CreateTrip /> },      // "/create-trip"
      { path: "view-trip/:tripId", element: <Viewtrip /> },  // "/view-trip/:tripId"
      { path: "my-trips", element: <MyTrips /> },            // "/my-trips"
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

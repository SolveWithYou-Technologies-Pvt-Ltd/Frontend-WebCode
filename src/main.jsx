import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* HelmetProvider ko yahan wrap kiya gaya hai */}
    <HelmetProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
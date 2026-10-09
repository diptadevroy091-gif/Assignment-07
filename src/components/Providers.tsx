"use client";

import { Toaster } from "react-hot-toast";

export default function Providers() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          padding: "14px 18px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#16804a",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
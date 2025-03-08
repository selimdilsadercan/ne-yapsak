"use client";

import { Toaster } from "react-hot-toast";

function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))"
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "hsl(var(--success))",
            secondary: "hsl(var(--success-foreground))"
          }
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "hsl(var(--destructive))",
            secondary: "hsl(var(--destructive-foreground))"
          }
        }
      }}
    />
  );
}

export { ToastProvider };

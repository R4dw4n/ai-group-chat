"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        // No token found, redirect to login
        const currentLocale = i18n.language || "en";
        router.push(`/${currentLocale}/login`);
        return;
      }

      // Token exists, allow access
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, i18n.language]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return children;
}

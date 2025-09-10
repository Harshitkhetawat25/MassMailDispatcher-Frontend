"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import Loader from "@/components/ui/loader";
import { useIsMobile } from "../hooks/use-mobile";

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use the hook to fetch user data and get the loading state
  const { user, loading } = useGetCurrentUser();

  useEffect(() => {
    // Only redirect if we're not loading and user is definitely null
    if (!loading && user === null) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    }
    if (user) {
      console.log("User found:", user);
    }
  }, [user, navigate, loading]);

  // Show loading spinner while checking authentication
  if (loading || user === undefined) {
    return <Loader fullScreen size="xl" />;
  }

  // Don't render dashboard if user is not authenticated
  if (!user) {
    return null;
  }

  const stats = {
    sent: 120,
    failed: 5,
    drafts: 12,
  };

  const recentActivity = [
    "Email sent to 200 users (CSV_28Aug.csv)",
    "Template 'Welcome Offer' updated",
    "5 emails failed due to invalid addresses",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isMobile ? "p-4" : "p-6"
          } ${isMobile && sidebarOpen ? "blur-sm" : ""}`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

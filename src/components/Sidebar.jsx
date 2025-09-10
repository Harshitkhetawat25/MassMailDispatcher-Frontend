"use client";

import { Button } from "@/components/ui/button";
import { Mail, Upload, FileText, Activity, Clock, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const user = {
  name: "John Doe",
  email: "john.doe@company.com",
  avatar: "/diverse-user-avatars.png",
};

export default function Sidebar({ isMobile, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (route) => {
    // Special case: when at root dashboard, send-mail should be active
    if (route === "send-mail" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.includes(route);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const handleClickOutside = (event) => {
        const sidebar = document.getElementById("sidebar");
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          ${
            isMobile
              ? `fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transform transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "relative"
          }
          w-64 border-r bg-card min-h-[calc(100vh-4rem)] flex flex-col
        `}
      >
        <nav className="p-4 space-y-2 flex-1">
          <Button
            variant={getActive("send-mail") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/send-mail")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Mail
          </Button>
          <Button
            variant={getActive("upload-csv") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/upload-csv")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
          <Button
            variant={getActive("manage-templates") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/manage-templates")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Manage Templates
          </Button>
          <Button
            variant={getActive("view-logs") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/view-logs")}
          >
            <Activity className="mr-2 h-4 w-4" />
            View Logs
          </Button>
          {/* <Button
            variant={getActive("drafts") ? "default" : "ghost"}
            className="w-full justify-start"
            size="sm"
            onClick={() => handleNavigation("/dashboard/drafts")}
          >
            <Clock className="mr-2 h-4 w-4" />
            Drafts
          </Button> */}
        </nav>
      </aside>
    </>
  );
}

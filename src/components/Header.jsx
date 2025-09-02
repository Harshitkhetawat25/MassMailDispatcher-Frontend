import { Button } from "@/components/ui/button";
import { Mail, Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useNavigate } from "react-router-dom";




export default function Header({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" onClick={() => navigate("/")} />
          <h1 className="text-lg md:text-xl font-semibold">
            {isMobile ? "MassMailer" : "Mass Mail Dispatcher"}
          </h1>
        </div>
      </div>
    </header>
  );
}

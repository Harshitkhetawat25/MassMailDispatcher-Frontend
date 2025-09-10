import HeaderHomePage from "../components/HeaderHomePage";
import { Outlet } from "react-router-dom";
import FooterHomePage from "../components/FooterHomePage"

function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderHomePage />
      <div className="flex-1">
        <Outlet />
      </div>
      <FooterHomePage />
    </div>
  );
}

export default WebsiteLayout;

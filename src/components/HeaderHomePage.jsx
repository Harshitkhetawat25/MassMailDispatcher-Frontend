import {
  Mail,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_URL } from "../../constants/config";
import axios from "axios";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";

function HeaderHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        API_URL + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(null));
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  const NavLink = ({ children, href = "#" }) => (
    <a
      href={href}
      className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </a>
  );
  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Mass Mail Dispatcher
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow px-6 py-2 rounded-md"
                  >
                    Dashboard
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/settings")}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded-md"
                  >
                    Login
                  </Button>
                  {/* <Button
                    onClick={() => navigate("/signup")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow px-6 py-2 rounded-md"
                  >
                    Sign Up
                  </Button> */}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3 bg-white shadow-lg rounded-b-xl">
              <div className="flex flex-col space-y-3 px-4">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#about">About</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow px-6 py-2 rounded-md w-full"
                    >
                      Dashboard
                    </Button>

                    <div className="border-t pt-3">
                      <div className="flex items-center space-x-3 px-2 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 mt-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          Account
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/settings");
                            setIsMenuOpen(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded-md w-full"
                    >
                      Login
                    </Button>
                    {/* <Button
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow px-6 py-2 rounded-md w-full"
                    >
                      Sign Up
                    </Button> */}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default HeaderHomePage;

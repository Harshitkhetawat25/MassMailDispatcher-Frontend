import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SlLogin } from "react-icons/sl";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
// Import your user action - adjust path as needed
import { setUserData } from "../redux/userSlice";

const LoginContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // Set user data in Redux if returned by API
      if (response.data.user) {
        dispatch(setUserData(response.data.user));
      }

      toast.success("Login successful");

      // Add a small delay to ensure Redux state is updated
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);

      // Check if email is not verified
      if (
        msg.toLowerCase().includes("email not verified") ||
        msg.toLowerCase().includes("not verified")
      ) {
        // Redirect to check-email page, pass email as state
        navigate("/check-email", { state: { email } });
      } else if (msg.toLowerCase().includes("created with google")) {
        // Clear password field for better UX
        setPassword("");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOnSuccess = async (tokenResponse) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          accessToken: tokenResponse.access_token,
          scope: tokenResponse.scope,
        },
        { withCredentials: true }
      );

      // Set user data in Redux if returned by API
      if (response.data.user) {
        dispatch(setUserData(response.data.user));
      }

      toast.success("Login successful");

      // Add a small delay to ensure Redux state is updated
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      const msg = err.response?.data?.message || "Google login failed";
      toast.error(msg);

      // Check if email is not verified
      if (
        msg.toLowerCase().includes("email not verified") ||
        msg.toLowerCase().includes("not verified")
      ) {
        // For Google login, we might not have email in state,
        // so just redirect to check-email page
        navigate("/check-email");
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleOnSuccess,
    onError: () => {
      toast.error("Google login failed");
    },
    scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
  });

  return (
    <div className="py-20 flex items-center justify-center px-4 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1 max-h-screen overflow-hidden">
        {/* Left side - Image (hidden on mobile) */}
        <div className="flex-1 bg-blue-900 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
          ></div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-blue-900">
                User Sign In
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Hey enter your details to sign into your account
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <input
                  className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <button
                  type="submit"
                  className="mt-4 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <SlLogin className="w-6 h-6 -ml-2" />
                      <span className="ml-3">Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="mx-4 text-gray-500 text-sm">OR</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <Button
                onClick={() => googleLogin()}
                variant="outline"
                className="w-full"
                disabled={isLoggingIn}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <p className="mt-6 text-xs text-gray-600 text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-900 font-semibold hover:underline focus:outline-none"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;

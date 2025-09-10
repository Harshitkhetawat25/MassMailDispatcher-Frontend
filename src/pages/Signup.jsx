import { useState, useEffect } from "react";
import api from "../lib/axios";
import { API_URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineUserAdd } from "react-icons/ai";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

const SignupContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Get current user state
  const { user, loading } = useGetCurrentUser();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && user.isVerified) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const response = await api.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      if (response.data.user) {
        toast.success(
          "Signup successful! Please check your email to verify your account."
        );
        navigate("/check-email", { state: { email } });
        return;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleOnSuccess = async (tokenResponse) => {
    try {
      const response = await api.post("/api/auth/google", {
        accessToken: tokenResponse.access_token,
        scope: tokenResponse.scope,
      });

      if (response.data.user) {
        dispatch(setUserData(response.data.user));
      }

      toast.success("Signup successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Signup failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleOnSuccess,
    onError: () => {
      toast.error("Google signup failed");
    },
    scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
  });

  return (
    <div className="py-20 items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-blue-900 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className=" flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                User Sign Up
              </h1>
              <p className="text-[12px] text-gray-500">
                Hey enter your details to create your account
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleSignup}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineUserAdd className="w-6 h-6 -ml-2" />
                      <span className="ml-3">Sign Up</span>
                    </>
                  )}
                </button>
                <Button
                  onClick={() => googleLogin()}
                  variant="outline"
                  className="w-full"
                  disabled={isSigningUp}
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
                  Signup with Google
                </Button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?{" "}
                  <a href="">
                    <span
                      className="text-blue-900 font-semibold"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <SignupContent />
    </GoogleOAuthProvider>
  );
};

export default Signup;

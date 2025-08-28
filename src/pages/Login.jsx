import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SlLogin } from "react-icons/sl";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 

 const handleLogin = async(e)=> {
    e.preventDefault();
    try{
     await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    })
    navigate("/dashboard");
    toast.success("Login successful");

    }catch(err) {
        toast.error(err.response.data.message);
    }
    
 }
 const handleOnSuccess = async(credentialResponse) =>{
     await axios.post(`${API_URL}/api/auth/google`,{token:credentialResponse.credential})
     .then(res=>{
       navigate("/dashboard");
       toast.success("Login successful");
     })
     .catch(err=>{
       toast.error(err.response.data.message);
     })
   }

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
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
                User Sign In
              </h1>
              <p className="text-[12px] text-gray-500">
                Hey enter your details to create your account
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter your email"
                  onChange = {(e)=>setEmail(e.target.value)}
                  value={email}
                />
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                  onChange = {(e)=>setPassword(e.target.value)}
                  value={password}
                />
                <button className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none" onClick={handleLogin}>
                  <SlLogin className="w-6 h-6 -ml-2" />
                  <span className="ml-3">Sign In</span>
                </button>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleOnSuccess}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don't have an account?{" "}
                  <a href="">
                    <span className="text-blue-900 font-semibold" onClick={()=>navigate("/signup")}>Sign Up</span>
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
export default Signup;

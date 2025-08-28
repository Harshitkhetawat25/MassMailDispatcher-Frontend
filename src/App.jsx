
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MassMailDispatcher from "./pages/MassMailDispatcher";
import Dashboard from "./pages/Dashboard"
import { Route, Routes } from "react-router-dom";

function App() {
 
  return (
    <>
        <Routes>
          <Route path="/" element={<MassMailDispatcher />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Routes>
 
      <ToastContainer />
    </>
  );
}

export default App;

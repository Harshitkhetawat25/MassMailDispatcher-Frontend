import { lazy, Suspense, Component } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider";
import Loader from "./components/ui/loader";
import WebsiteLayout from "./pages/WebsiteLayout";
import CheckEmail from "./pages/CheckEmail";

// Lazy load components for better performance
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const MassMailDispatcher = lazy(() => import("./pages/MassMailDispatcher"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ViewLogs = lazy(() => import("./pages/ViewLogs"));
const ManageTemplates = lazy(() => import("./pages/ManageTemplates"));
const SendMail = lazy(() => import("./pages/SendMail"));
const UploadCsv = lazy(() => import("./pages/UploadCsv"));
const Drafts = lazy(() => import("./pages/Drafts"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Settings = lazy(() => import("./pages/Settings"));

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullScreen size="xl" />}>
        <Routes>
          <Route path="/" element={<MassMailDispatcher />} />
          <Route path="dashboard/*" element={<Dashboard />}>
            <Route index element={<SendMail />} />
            <Route path="send-mail" element={<SendMail />} />
            <Route path="upload-csv" element={<UploadCsv />} />
            <Route path="manage-templates" element={<ManageTemplates />} />
            <Route path="view-logs" element={<ViewLogs />} />
            <Route path="drafts" element={<Drafts />} />
          </Route>
          {/* Wrap login and signup in WebsiteLayout */}
          <Route element={<WebsiteLayout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route
            path="settings"
            element={
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            }
          />
          </Route>
          <Route path="check-email" element={<CheckEmail />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          
        </Routes>
      </Suspense>

      <ToastProvider />
    </ErrorBoundary>
  );
}

export default App;

import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "./utils/storage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import PageTransition from "./components/common/PageTransition";
import ConnectionStatus from "./components/common/ConnectionStatus";

// Lazy load components
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Groups = lazy(() => import("./pages/Groups"));
const GroupDetails = lazy(() => import("./pages/GroupDetails"));
const History = lazy(() => import("./pages/History"));
const Notifications = lazy(() => import("./pages/Notifications"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const token = getToken();
  return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('checking');

  // Monitor Network Connection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Back Online!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('📡 No Internet Connection', {
        position: 'bottom-right',
        autoClose: false,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor Server Status
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('degraded');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    // Check immediately
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen gradient-mesh">
        <ConnectionStatus isOnline={isOnline} serverStatus={serverStatus} />
        
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <PageTransition>
                    <Landing />
                  </PageTransition>
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <PageTransition>
                    <Login />
                  </PageTransition>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <PageTransition>
                    <Register />
                  </PageTransition>
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Groups />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <GroupDetails />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <History />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Notifications />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PublicRoute>
                  <PageTransition>
                    <VerifyEmail />
                  </PageTransition>
                </PublicRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;

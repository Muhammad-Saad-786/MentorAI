import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Mentor from "./pages/Mentor";
import DSA from "./pages/DSA";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardShell from "./components/layout/DashboardShell";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#1A1A2E",
              border: "1px solid #E8D5C4",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/mentor" element={<Mentor />} />
            <Route path="/dsa" element={<DSA />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

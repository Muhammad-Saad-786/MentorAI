import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFBF5",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the page they tried to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

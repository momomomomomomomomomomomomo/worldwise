import { useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(function () {
    if (!isAuthenticated) navigate("/");
  });
  return isAuthenticated && children;
}

export default ProtectedRoute;

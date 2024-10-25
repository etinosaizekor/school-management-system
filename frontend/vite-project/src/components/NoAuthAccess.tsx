import { useEffect } from "react";
import { getCookie } from "../utils/cookieUtils";
import { Outlet, useNavigate } from "react-router-dom";

function NoAuthAccess() {
  const navigate = useNavigate();
  const token = getCookie("Authorization"); // Replace with your cookie name if different

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true }); // Redirect to the protected route
    }
  }, [token, navigate]);

  // Render Outlet only if there's no token (i.e., user is not logged in)
  return !token ? <Outlet /> : null;
}

export default NoAuthAccess;

import { useEffect } from "react";
import { getCookie } from "../utils/cookieUtils";
import { Outlet, useNavigate } from "react-router-dom";

function NoAuthAccess() {
  const navigate = useNavigate();
  const token = getCookie("Authorization");

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return !token ? <Outlet /> : null;
}

export default NoAuthAccess;

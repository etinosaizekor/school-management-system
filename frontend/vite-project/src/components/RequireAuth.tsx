import { useEffect } from "react";
import { getCookie } from "../utils/cookieUtils";
import { Outlet, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Cookies from "js-cookie";

function RequireAuth() {
  const navigate = useNavigate();
  const token = getCookie("Authorization");
  console.log("token obtained", token);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default RequireAuth;

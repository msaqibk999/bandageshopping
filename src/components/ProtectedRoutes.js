import React, { useEffect } from "react";
import { GetToken } from "../utils/Login_logoutUser";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if(!GetToken()) navigate("/login");
  },[])

  return <>{GetToken() ? <Outlet /> : null}</>;
};

export default ProtectedRoutes;

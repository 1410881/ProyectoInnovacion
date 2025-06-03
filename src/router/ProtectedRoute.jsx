import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../js/UserContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useUser();
  const role = localStorage.getItem("user_role");

  // Si no está logueado, redirige a login
  if (!user) return <Navigate to="/login" replace />;

  // Si requiere un rol específico y no lo tiene, redirige a inicio
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
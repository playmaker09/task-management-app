// src/components/AuthRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface AuthRouteProps {
    children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
    const token = localStorage.getItem("token");
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AuthRoute;

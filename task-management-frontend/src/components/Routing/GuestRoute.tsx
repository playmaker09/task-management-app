// src/components/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface GuestRouteProps {
    children: ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/" /> : <>{children}</>;
};

export default GuestRoute;

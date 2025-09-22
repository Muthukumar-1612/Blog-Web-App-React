import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function RequireAuth() {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default RequireAuth;
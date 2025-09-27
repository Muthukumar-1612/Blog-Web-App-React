import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, checkAuth } from "../store/auth";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const redirectTo = params.get("redirectTo") || "/";

        if (token) {
            dispatch(setToken(token)); // store in redux + localStorage
            dispatch(checkAuth());     // fetch user info
            window.history.replaceState(null, "", redirectTo);
            navigate(redirectTo, { replace: true });
        } else {
            navigate("/login");
        }
    }, [dispatch, navigate, location]);

    return <p>Signing you in...</p>;
};

export default OAuthSuccess;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../store/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

const OauthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (window.opener) {
            // Notify main window
            window.opener.postMessage({ status: "success" }, frontend_URL);
            // Close popup
            window.close();
        }
    }, []);

    return <div>Logging in...</div>;
};

export default OauthSuccess;
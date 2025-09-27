import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../store/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

const OauthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const redirectTo = searchParams.get("redirectTo") || "/";
        const success = searchParams.get("success") === "true";

        if (success) {
            // Small delay to ensure session is saved
            setTimeout(() => {
                dispatch(checkAuth())
                    .unwrap()
                    .then(() => {
                        navigate(redirectTo, { replace: true });
                    })
                    .catch((error) => {
                        console.error("OAuth auth check failed:", error);
                        navigate("/login", { 
                            state: { error: "OAuth authentication failed" } 
                        });
                    });
            }, 500);
        } else {
            navigate("/login", { 
                state: { error: "OAuth flow was not successful" } 
            });
        }
    }, [dispatch, navigate, searchParams]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Completing authentication...</span>
            </div>
            <span className="ms-3">Completing authentication...</span>
        </div>
    );
};

export default OauthSuccess;

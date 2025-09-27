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

        console.log("Current cookies:", document.cookie);
        console.log("Current domain:", window.location.hostname);

        if (success) {
            // Add a delay to ensure cookie is processed by browser
            const attemptAuthCheck = (attempt = 1) => {
                console.log(`Auth check attempt ${attempt}`);

                dispatch(checkAuth())
                    .unwrap()
                    .then((userData) => {
                        console.log("OAuth success, user:", userData);
                        navigate(redirectTo, { replace: true });
                    })
                    .catch((error) => {
                        console.error(`Auth check failed attempt ${attempt}:`, error);

                        if (attempt < 3) {
                            // Retry after delay
                            setTimeout(() => attemptAuthCheck(attempt + 1), 1000 * attempt);
                        } else {
                            // Final fallback
                            console.error("All auth checks failed, redirecting to login");
                            navigate("/login", {
                                state: { error: "Authentication failed. Please try logging in manually." }
                            });
                        }
                    });
            };

            // Start first attempt after short delay
            setTimeout(() => attemptAuthCheck(1), 500);
        } else {
            navigate("/login", {
                state: { error: "OAuth authentication was not successful" }
            });
        }
    }, [dispatch, navigate, searchParams]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Completing authentication...</span>
                </div>
                <div>Completing authentication...</div>
                <small className="text-muted">This may take a few seconds</small>
            </div>
        </div>
    );
};

export default OauthSuccess;
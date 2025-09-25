import { useEffect } from "react";

const OauthSuccess = () => {
    const isProd = import.meta.env.VITE_ENV === "production";
    const frontend_URL = isProd ? import.meta.env.VITE_RENDER_FRONTEND_URL : import.meta.env.VITE_LOCAL_FRONTEND_URL;
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

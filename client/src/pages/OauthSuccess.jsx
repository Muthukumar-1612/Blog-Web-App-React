import { useEffect } from "react";

const OauthSuccess = () => {
    useEffect(() => {
        if (window.opener) {
            // Notify main window
            window.opener.postMessage({ status: "success" }, window.location.origin);
            // Close popup
            window.close();
        }
    }, []);

    return <div>Logging in...</div>;
};

export default OauthSuccess;

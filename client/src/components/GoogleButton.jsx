import React, { useState } from "react";

export const GoogleButton = ({ backend_URL }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {

        setLoading(true);

        const oauthUrl = `${backend_URL}/api/auth/google`;

        const width = 500;
        const height = 600;

        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            oauthUrl,
            "_blank",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer); // stop polling
                setLoading(false);    // reset loading state
            }
        }, 500);

    };




    return (
        <button
            className="google-btn"
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    Redirecting...
                </>
            ) : (
                <>
                    <img src="images/icons8-google-logo.svg" alt="google-logo" />
                    <span>Continue with Google</span>
                </>
            )}
        </button>
    );
};

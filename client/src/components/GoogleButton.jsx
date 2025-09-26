import React, { useState } from "react";

export const GoogleButton = ({ backend_URL, redirectTo }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {

        setLoading(true);

        window.location.href = `${backend_URL}/api/auth/google?redirectTo=${redirectTo || "/"}`;

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

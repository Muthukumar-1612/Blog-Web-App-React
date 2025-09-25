import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../store/auth";

const AuthListener = () => {

    const isProd = import.meta.env.VITE_ENV === "production";
    const backend_URL = isProd ? import.meta.env.VITE_RENDER_BACKEND_URL : import.meta.env.VITE_LOCAL_BACKEND_URL;
    const backendOrigin = new URL(backend_URL).origin;
    console.log(backendOrigin);
    console.log(window.location.origin);




    const dispatch = useDispatch();

    useEffect(() => {
        const listener = (event) => {
            // Only trust your backend origin
            // console.log("Message received:", event);
            // console.log(event.origin);

            if (event.origin !== backendOrigin) return;

            if (event.data.status === "success") {
                // After OAuth popup succeeds, fetch user
                dispatch(checkAuth());
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [dispatch]);

    return null; // this component doesn't render UI
};

export default AuthListener;

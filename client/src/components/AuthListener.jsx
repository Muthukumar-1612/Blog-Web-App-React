import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../store/auth";

const AuthListener = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const listener = (event) => {

            if (event.origin !== window.location.origin) return;

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

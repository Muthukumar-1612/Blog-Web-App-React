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
        // Ask backend for logged-in user
        dispatch(checkAuth())
            .unwrap()
            .then(() => navigate(redirectTo, { replace: true }))
            .catch(() => navigate("/login"));
    }, [dispatch, navigate, searchParams]);

    return null;
};

export default OauthSuccess;
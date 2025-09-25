import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { user_login, resetAuthState } from "../store/auth";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "./Password";
import { GoogleButton } from "./GoogleButton";

const isProd = import.meta.env.VITE_ENV === "production";
const backend_URL = isProd ? import.meta.env.VITE_RENDER_BACKEND_URL : import.meta.env.VITE_LOCAL_BACKEND_URL;

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate(redirectTo, { replace: true });
        }
        dispatch(resetAuthState());
    }, [user, navigate, dispatch]);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Determine redirect after login
    const redirectTo = location.state?.from?.pathname

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(user_login(formData)).unwrap();
        } catch (err) {
            console.error("Login failed:", err);
        }

    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 120px)" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="p-4 border rounded shadow bg-white">
                    {/* Google OAuth */}
                    <div className="text-center mb-3">
                        <GoogleButton backend_URL={backend_URL} />
                    </div>

                    <div className="d-flex align-items-center mb-3">
                        <hr className="flex-grow-1" />
                        <span className="mx-2">OR</span>
                        <hr className="flex-grow-1" />
                    </div>
                    <form
                        onSubmit={handleSubmit}
                    >
                        {/* Email */}
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group mb-3">
                            <PasswordInput
                                value={formData.password}
                                onChange={handleChange}
                                name="password"
                                placeholder="Password"
                                required={true}
                                minLength={0}
                                autoComplete="email"
                            />
                        </div>

                        {/* Error Messages */}
                        {(error) && (
                            <div className="alert alert-danger py-2 text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Logging...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                {/* Redirect to Register */}
                <p className="text-center mt-3">
                    Create an account?{" "}
                    <Link
                        className="text-primary text-decoration-none"
                        to={"/register"}
                        onClick={() => dispatch(resetAuthState())}
                        state={{ from: location.state?.from || location.pathname }}
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>

    );
}

export default Login;
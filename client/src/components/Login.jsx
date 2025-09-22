import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { user_login, resetAuthState } from "../store/auth";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "./Password";

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    useEffect(() => {
        dispatch(resetAuthState());
    }, [dispatch]);

    const { status, error } = useSelector((state) => state.auth);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(user_login(formData)).unwrap();
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
        }

    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 120px)" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form
                    className="p-4 border rounded shadow bg-white"
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
                {/* Redirect to Register */}
                <p className="text-center mt-3">
                    Create an account?{" "}
                    <Link
                        className="text-primary text-decoration-none"
                        to={"/register"}
                        onClick={() => dispatch(resetAuthState())}
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>

    );
}

export default Login;
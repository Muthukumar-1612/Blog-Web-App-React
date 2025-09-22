import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { user_register, resetAuthState } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./Password";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(resetAuthState());
    }, [dispatch]);

    const { status, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // local validation error (e.g., password mismatch)
    const [localError, setLocalError] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setLocalError(null); // clear error when user types again
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Please make sure both passwords match");
            return;
        }

        try {
            await dispatch(user_register(formData)).unwrap();
            navigate("/");
        } catch (err) {
            console.error("Registration failed:", err);
        }

    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 120px)" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Register</h2>
                <form
                    className="p-4 border rounded shadow bg-white"
                    onSubmit={handleSubmit}
                >
                    {/* Name */}
                    <div className="form-group mb-3 pt-2">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </div>

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
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group mb-3">
                        <PasswordInput
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required={true}
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Error Messages */}
                    {(localError || error) && (
                        <div className="alert alert-danger py-2 text-center">
                            {localError || error}
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
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </div>
                </form>
                {/* Redirect to Login */}
                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link
                        className="text-primary text-decoration-none"
                        to={"/login"}
                        onClick={() => {
                            dispatch(resetAuthState());
                            setLocalError(null); // clear local error
                        }}
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>

    );
}

export default Register;

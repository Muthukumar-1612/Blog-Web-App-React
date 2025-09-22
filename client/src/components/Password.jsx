import React, { useState } from "react";

const PasswordInput = ({
    value,
    onChange,
    placeholder = "Password",
    name = "",
    required = false,
    minLength,
    className = ""
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`password-input-group ${className} position-relative`}>
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                className="form-control pe-5" // pe-5 ensures space for icon
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
            />
            <span
                onClick={toggleVisibility}
                role="button"
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer", color: "#6c757d" }}
            >
                {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                ) : (
                    <i className="bi bi-eye"></i>
                )}
            </span>
        </div>
    );
};

export default PasswordInput;

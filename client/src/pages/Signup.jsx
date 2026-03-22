import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    setIsError(false);
    setMessage("Sign up successful.");

    setTimeout(() => {
      navigate("/login");
    }, 900);
  };

  return (
    <div className="simple-auth-page">
      <div className="wire-auth-card">
        <div className="wire-auth-header">
          <h2>Welcome to TableMates!</h2>
          <p>Create your account to start booking tables.</p>
        </div>

        <form onSubmit={handleSubmit} className="wire-auth-form">
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div className={isError ? "status-message error" : "status-message success"}>
              {message}
            </div>
          )}

          <button type="submit" className="primary-btn full-width">
            Sign Up
          </button>
        </form>

        <div className="wire-auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="wire-auth-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const msg = sessionStorage.getItem("loginMessage");

    if (msg) {
      setRedirectMessage(msg);
      sessionStorage.removeItem("loginMessage");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setIsError(true);
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const result = await loginUser(formData);

      if (result.user.role === "admin") {
        throw new Error("Use the admin login page for admin accounts.");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsError(false);
      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/user-home");
      }, 800);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Login failed.");
    }
  };

  return (
    <div className="simple-auth-page">
      <div className="wire-auth-card">
        <div className="wire-auth-header">
          <h2>Login</h2>
          <p>Access your account to manage reservations.</p>
        </div>

        {redirectMessage && (
          <div className="status-message error">
            {redirectMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="wire-auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

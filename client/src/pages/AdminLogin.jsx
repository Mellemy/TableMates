import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(formData);

      if (result.user.role !== "admin") {
        throw new Error("This account is not an admin account.");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsError(false);
      setMessage("Login successful.");
      navigate("/admin");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Invalid admin credentials.");
    }
  };

  return (
    <div className="simple-auth-page">
      <div className="wire-auth-card">
        <div className="wire-auth-header">
          <h2>Admin Login</h2>
          <p>Login to manage your restaurant dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="wire-auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter admin email"
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
              placeholder="Enter password"
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

        <div className="wire-auth-footer">
          <span>Demo accounts:</span>
          <span className="wire-auth-link">bellaadmin@tablemates.com / admin123</span>
          <span className="wire-auth-link">sushiadmin@tablemates.com / admin123</span>
          <span className="wire-auth-link">burgeradmin@tablemates.com / admin123</span>
          <span className="wire-auth-link">goldenadmin@tablemates.com / admin123</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

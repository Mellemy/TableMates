import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const adminAccounts = [
    {
      username: "bellaadmin",
      password: "admin123",
      restaurantId: 1,
      restaurantName: "Bella Italia",
    },
    {
      username: "sushiadmin",
      password: "admin123",
      restaurantId: 2,
      restaurantName: "Sushi House",
    },
    {
      username: "burgeradmin",
      password: "admin123",
      restaurantId: 3,
      restaurantName: "Burger Corner",
    },
    {
      username: "goldenadmin",
      password: "admin123",
      restaurantId: 4,
      restaurantName: "Golden Fork",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchedAdmin = adminAccounts.find(
      (admin) =>
        admin.username === formData.username &&
        admin.password === formData.password
    );

    if (matchedAdmin) {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminData", JSON.stringify(matchedAdmin));

      setIsError(false);
      setMessage("Login successful.");
      navigate("/admin");
    } else {
      setIsError(true);
      setMessage("Invalid admin credentials.");
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
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter admin username"
              value={formData.username}
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
          <span className="wire-auth-link">bellaadmin / admin123</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
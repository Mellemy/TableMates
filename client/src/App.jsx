import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import Reservation from "./pages/Reservation";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ManageTables from "./pages/ManageTables";
import "./index.css";

function ProtectedAdminRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAdminLoggedIn ? children : <Navigate to="/admin-login" replace />;
}

function ProtectedUserRoute({ children }) {
  const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";

  if (!isUserLoggedIn) {
    sessionStorage.setItem("loginMessage", "Please login to continue");
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="app-shell">
        <nav className="premium-navbar">
          <div className="navbar-inner wide-container">
            <div className="navbar-brand-wrap">
              <div className="brand-mark">T</div>
              <div className="navbar-brand-text">
                <span className="brand-name">TableMates</span>
                <span className="brand-subtitle">Restaurant Reservation System</span>
              </div>
            </div>

            <div className="navbar-links">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Home
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/admin-login"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Admin Login
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="page-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/user-home"
              element={
                <ProtectedUserRoute>
                  <UserHome />
                </ProtectedUserRoute>
              }
            />

            <Route
              path="/reservation"
              element={
                <ProtectedUserRoute>
                  <Reservation />
                </ProtectedUserRoute>
              }
            />

            <Route
              path="/reservation-confirmation"
              element={
                <ProtectedUserRoute>
                  <ReservationConfirmation />
                </ProtectedUserRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/manage-tables"
              element={
                <ProtectedAdminRoute>
                  <ManageTables />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
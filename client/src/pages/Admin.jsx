import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReservations,
  updateReservation,
  deleteReservation,
} from "../services/adminService";

function Admin() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    restaurantId: "",
    restaurantName: "",
    tableId: "",
    tableNumber: "",
    date: "",
    time: "",
    guests: "",
  });

  const navigate = useNavigate();

  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const restaurantId = adminData.restaurantId;
  const restaurantName = adminData.restaurantName;

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load reservations.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const myReservations = useMemo(() => {
    return reservations.filter(
      (reservation) => Number(reservation.restaurantId) === Number(restaurantId)
    );
  }, [reservations, restaurantId]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirmDelete) return;

    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete reservation.");
    }
  };

  const handleEditClick = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      name: reservation.name,
      restaurantId: reservation.restaurantId,
      restaurantName: reservation.restaurantName || "",
      tableId: reservation.tableId || "",
      tableNumber: reservation.tableNumber || "",
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
    });
    setError("");
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updated = await updateReservation(editingId, {
        ...editForm,
        restaurantId: Number(editForm.restaurantId),
        tableId: Number(editForm.tableId),
        guests: Number(editForm.guests),
      });

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === editingId ? updated.data : reservation
        )
      );

      setEditingId(null);
      setEditForm({
        name: "",
        restaurantId: "",
        restaurantName: "",
        tableId: "",
        tableNumber: "",
        date: "",
        time: "",
        guests: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update reservation.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      restaurantId: "",
      restaurantName: "",
      tableId: "",
      tableNumber: "",
      date: "",
      time: "",
      guests: "",
    });
  };

  const todayReservations = myReservations.filter(
    (reservation) => reservation.date === new Date().toISOString().split("T")[0]
  ).length;

  const totalGuests = myReservations.reduce(
    (sum, reservation) => sum + Number(reservation.guests || 0),
    0
  );

  return (
    <div className="business-dashboard-page">
      <div className="dashboard-header-card">
        <div>
          <span className="section-kicker">Business Dashboard</span>
          <h1>{restaurantName || "Restaurant"} Dashboard</h1>
          <p>Manage reservations and operations for your restaurant only.</p>
        </div>

        <div className="dashboard-header-actions">
          <button className="secondary-btn" onClick={() => navigate("/manage-tables")}>
            Manage Tables
          </button>
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <span>Total Reservations</span>
          <strong>{myReservations.length}</strong>
        </div>

        <div className="dashboard-stat-card">
          <span>Today’s Reservations</span>
          <strong>{todayReservations}</strong>
        </div>

        <div className="dashboard-stat-card">
          <span>Total Guests</span>
          <strong>{totalGuests}</strong>
        </div>
      </div>

      {error && <div className="status-message error">{error}</div>}

      {editingId && (
        <div className="dashboard-panel">
          <div className="section-header">
            <span className="section-kicker">Edit Reservation</span>
            <h2>Update reservation details</h2>
          </div>

          <form onSubmit={handleUpdate} className="reservation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-name">Customer Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-restaurant">Restaurant</label>
                <input
                  id="edit-restaurant"
                  type="text"
                  name="restaurantName"
                  value={editForm.restaurantName}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-tableNumber">Table</label>
                <input
                  id="edit-tableNumber"
                  type="text"
                  name="tableNumber"
                  value={editForm.tableNumber}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-guests">Guests</label>
                <input
                  id="edit-guests"
                  type="number"
                  name="guests"
                  min="1"
                  value={editForm.guests}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-date">Date</label>
                <input
                  id="edit-date"
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-time">Time</label>
                <input
                  id="edit-time"
                  type="time"
                  name="time"
                  value={editForm.time}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="dashboard-form-actions">
              <button type="submit" className="primary-btn">
                Save Changes
              </button>
              <button type="button" className="secondary-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-panel">
        <div className="section-header">
          <span className="section-kicker">Reservations</span>
          <h2>{restaurantName || "Restaurant"} bookings</h2>
          <p>Only reservations for this restaurant are shown here.</p>
        </div>

        {myReservations.length === 0 ? (
          <div className="empty-state">
            <h3>No reservations yet</h3>
            <p>New reservations for this restaurant will appear here.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myReservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.restaurantName || "—"}</td>
                    <td>{r.tableNumber || "—"}</td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.guests}</td>
                    <td>
                      <div className="table-action-group">
                        <button onClick={() => handleEditClick(r)} className="edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
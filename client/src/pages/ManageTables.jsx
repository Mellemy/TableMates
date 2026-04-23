import { useEffect, useMemo, useState } from "react";
import {
  createTable,
  deleteTable,
  getRestaurantTables,
  updateTable,
} from "../services/tableService";

function ManageTables() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const restaurantId = user.restaurantId;
  const restaurantName = user.restaurantName;
  const [tables, setTables] = useState([]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    seats: "",
    status: "Available",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      if (!restaurantId) return;

      try {
        const data = await getRestaurantTables(restaurantId);
        setTables(data);
      } catch (error) {
        setIsError(true);
        setMessage(error.message || "Failed to load tables.");
      }
    };

    fetchTables();
    const intervalId = window.setInterval(fetchTables, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [restaurantId]);

  const myTables = useMemo(() => {
    return tables.filter((table) => String(table.restaurantId) === String(restaurantId));
  }, [tables, restaurantId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      tableNumber: "",
      seats: "",
      status: "Available",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.tableNumber || !formData.seats || !formData.status) {
      setIsError(true);
      setMessage("Please fill all fields.");
      return;
    }

    if (Number(formData.seats) <= 0) {
      setIsError(true);
      setMessage("Seats must be at least 1.");
      return;
    }

    const normalizedTableNumber = formData.tableNumber.trim().toUpperCase();
    const duplicateTable = tables.find(
      (table) =>
        table.id !== editingId &&
        String(table.restaurantId) === String(restaurantId) &&
        table.tableNumber.trim().toUpperCase() === normalizedTableNumber
    );

    if (duplicateTable) {
      setIsError(true);
      setMessage("This table number already exists for your restaurant.");
      return;
    }

    try {
      if (editingId) {
        const updatedTable = await updateTable(editingId, {
          tableNumber: normalizedTableNumber,
          seats: Number(formData.seats),
          status: formData.status,
        });

        setTables((prev) =>
          prev.map((table) => (table.id === editingId ? updatedTable : table))
        );
        setMessage("Table updated successfully.");
      } else {
        const newTable = await createTable({
          tableNumber: normalizedTableNumber,
          seats: Number(formData.seats),
          status: formData.status,
        });

        setTables((prev) => [...prev, newTable]);
        setMessage("Table added successfully.");
      }

      setIsError(false);
      resetForm();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to save table.");
    }
  };

  const handleEdit = (table) => {
    setEditingId(table.id);
    setFormData({
      tableNumber: table.tableNumber,
      seats: table.seats,
      status: table.status,
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this table?");
    if (!confirmed) return;

    try {
      await deleteTable(id);
      setTables((prev) => prev.filter((table) => table.id !== id));
      setMessage("Table deleted successfully.");
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to delete table.");
    }

    if (editingId === id) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  return (
    <div className="business-dashboard-page">
      <div className="dashboard-header-card">
        <div>
          <span className="section-kicker">Manage Tables</span>
          <h1>{restaurantName || "Restaurant"} Table Management</h1>
          <p>Add, update, and organize tables only for your restaurant.</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="section-header">
          <span className="section-kicker">
            {editingId ? "Edit Table" : "Add Table"}
          </span>
          <h2>{editingId ? "Update table details" : "Create a new table"}</h2>
          <p>Manage table availability for {restaurantName || "your restaurant"}.</p>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tableNumber">Table Number</label>
              <input
                id="tableNumber"
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
                placeholder="e.g. T5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="seats">Seats</label>
              <input
                id="seats"
                type="number"
                name="seats"
                min="1"
                value={formData.seats}
                onChange={handleChange}
                placeholder="Number of seats"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="table-select"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {message && (
            <div className={isError ? "status-message error" : "status-message success"}>
              {message}
            </div>
          )}

          <div className="dashboard-form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? "Save Changes" : "Add Table"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="dashboard-panel">
        <div className="section-header">
          <span className="section-kicker">Table Overview</span>
          <h2>{restaurantName || "Restaurant"} tables</h2>
          <p>Only tables for this restaurant are shown here.</p>
        </div>

        {myTables.length === 0 ? (
          <div className="empty-state">
            <h3>No tables added yet</h3>
            <p>Add your first table to begin managing this restaurant’s capacity.</p>
          </div>
        ) : (
          <div className="manage-tables-grid">
            {myTables.map((table) => (
              <div className="table-status-card" key={table.id}>
                <div className="table-card-top">
                  <h3>{table.tableNumber}</h3>
                  <span className={`table-badge ${table.status.toLowerCase()}`}>
                    {table.status}
                  </span>
                </div>

                <p><strong>Seats:</strong> {table.seats}</p>

                <div className="table-card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(table)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(table.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTables;

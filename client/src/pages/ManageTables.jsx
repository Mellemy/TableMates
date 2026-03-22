import { useMemo, useState } from "react";

function ManageTables() {
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const restaurantId = adminData.restaurantId;
  const restaurantName = adminData.restaurantName;

  const [tables, setTables] = useState([
    { id: 1, restaurantId: 1, tableNumber: "T1", seats: 2, status: "Available" },
    { id: 2, restaurantId: 1, tableNumber: "T2", seats: 4, status: "Reserved" },
    { id: 3, restaurantId: 2, tableNumber: "T1", seats: 2, status: "Available" },
    { id: 4, restaurantId: 2, tableNumber: "T2", seats: 6, status: "Maintenance" },
    { id: 5, restaurantId: 3, tableNumber: "T1", seats: 4, status: "Available" },
    { id: 6, restaurantId: 4, tableNumber: "T1", seats: 8, status: "Reserved" },
  ]);

  const [formData, setFormData] = useState({
    tableNumber: "",
    seats: "",
    status: "Available",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const myTables = useMemo(() => {
    return tables.filter((table) => Number(table.restaurantId) === Number(restaurantId));
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

  const handleSubmit = (e) => {
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

    if (editingId) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === editingId
            ? {
                ...table,
                tableNumber: formData.tableNumber,
                seats: Number(formData.seats),
                status: formData.status,
              }
            : table
        )
      );

      setIsError(false);
      setMessage("Table updated successfully.");
    } else {
      const newTable = {
        id: Date.now(),
        restaurantId: Number(restaurantId),
        tableNumber: formData.tableNumber,
        seats: Number(formData.seats),
        status: formData.status,
      };

      setTables((prev) => [...prev, newTable]);
      setIsError(false);
      setMessage("Table added successfully.");
    }

    resetForm();
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

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this table?");
    if (!confirmed) return;

    setTables((prev) => prev.filter((table) => table.id !== id));
    setMessage("Table deleted successfully.");
    setIsError(false);

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
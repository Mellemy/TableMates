import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createReservation } from "../services/reservationService";
import { getRestaurantTables } from "../services/tableService";

function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedRestaurantId = location.state?.restaurantId || "";
  const selectedRestaurantName = location.state?.restaurantName || "";

  const [formData, setFormData] = useState({
    name: "",
    restaurantId: selectedRestaurantId,
    restaurantName: selectedRestaurantName,
    tableId: "",
    tableNumber: "",
    date: "",
    time: "",
    guests: "",
  });

  const [tables, setTables] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      if (!selectedRestaurantId) return;

      try {
        setTableLoading(true);
        const data = await getRestaurantTables(selectedRestaurantId);
        setTables(data);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setMessage("Failed to load tables.");
      } finally {
        setTableLoading(false);
      }
    };

    fetchTables();
  }, [selectedRestaurantId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTableSelect = (e) => {
    const selectedId = e.target.value;
    const selectedTable = tables.find((table) => String(table.id) === selectedId);

    setFormData({
      ...formData,
      tableId: selectedId,
      tableNumber: selectedTable ? selectedTable.tableNumber : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.name ||
      !formData.restaurantId ||
      !formData.restaurantName ||
      !formData.tableId ||
      !formData.tableNumber ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      setIsError(true);
      setMessage("Please fill all fields and select a table.");
      return;
    }

    if (Number(formData.guests) <= 0) {
      setIsError(true);
      setMessage("Guests must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      await createReservation({
        ...formData,
        restaurantId: Number(formData.restaurantId),
        tableId: Number(formData.tableId),
        guests: Number(formData.guests),
      });

      navigate("/reservation-confirmation", {
        state: {
          reservation: {
            ...formData,
            restaurantId: Number(formData.restaurantId),
            tableId: Number(formData.tableId),
            guests: Number(formData.guests),
          },
        },
      });
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to submit reservation.");
    } finally {
      setLoading(false);
    }
  };

  const availableTables = tables.filter((table) => table.status === "Available");

  return (
    <div className="container wide-container">
      <div className="form-card">
        <div className="section-header">
          <span className="section-kicker">Reservation</span>
          <h2>Reserve a Table</h2>
          <p>Select your restaurant, available table, and booking details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label htmlFor="restaurantName">Restaurant Name</label>
            <input
              id="restaurantName"
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tableSelect">Available Tables</label>
            {tableLoading ? (
              <div className="table-loading-box">Loading tables...</div>
            ) : (
              <select
                id="tableSelect"
                value={formData.tableId}
                onChange={handleTableSelect}
                className="table-select"
                required
              >
                <option value="">Select a table</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.tableNumber} - {table.seats} seats
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="table-preview-grid">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`customer-table-card ${table.status.toLowerCase()} ${
                  String(formData.tableId) === String(table.id) ? "selected" : ""
                }`}
              >
                <h4>{table.tableNumber}</h4>
                <p>{table.seats} seats</p>
                <span>{table.status}</span>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input
                id="date"
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Select Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of People</label>
            <input
              id="guests"
              type="number"
              name="guests"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              placeholder="Enter number of guests"
              required
            />
          </div>

          {message && (
            <div className={isError ? "status-message error" : "status-message success"}>
              {message}
            </div>
          )}

          <button type="submit" className="primary-btn full-width" disabled={loading}>
            {loading ? "Submitting..." : "Reserve Table"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reservation;
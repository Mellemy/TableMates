import { Link, useLocation } from "react-router-dom";

function ReservationConfirmation() {
  const location = useLocation();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return (
      <div className="simple-auth-page">
        <div className="form-card">
          <div className="section-header">
            <span className="section-kicker">Reservation</span>
            <h2>No reservation found</h2>
            <p>Please make a reservation first.</p>
          </div>

          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-auth-page">
      <div className="confirmation-card">
        <div className="confirmation-top">
          <span className="section-kicker">Reservation Confirmed</span>
          <h2>Your table has been reserved successfully</h2>
          <p>Here are your reservation details.</p>
        </div>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Restaurant</span>
            <strong>{reservation.restaurantName}</strong>
          </div>

          <div className="confirmation-row">
            <span>Table</span>
            <strong>{reservation.tableNumber}</strong>
          </div>

          <div className="confirmation-row">
            <span>Name</span>
            <strong>{reservation.name}</strong>
          </div>

          <div className="confirmation-row">
            <span>Date</span>
            <strong>{reservation.date}</strong>
          </div>

          <div className="confirmation-row">
            <span>Time</span>
            <strong>{reservation.time}</strong>
          </div>

          <div className="confirmation-row">
            <span>People</span>
            <strong>{reservation.guests}</strong>
          </div>
        </div>

        <div className="confirmation-note">
          A confirmation has been recorded successfully. Please arrive 10 minutes before your booking time.
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReservationConfirmation;
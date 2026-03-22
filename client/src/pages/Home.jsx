import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const restaurants = [
    {
      id: 1,
      name: "Bella Italia",
      location: "City Center",
      rating: "4.8",
      openingTime: "10:00 AM - 11:00 PM",
      cuisine: "Italian",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      name: "Sushi House",
      location: "Main Street",
      rating: "4.7",
      openingTime: "11:00 AM - 10:30 PM",
      cuisine: "Japanese",
      image:
        "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      name: "Burger Corner",
      location: "Downtown",
      rating: "4.5",
      openingTime: "09:00 AM - 12:00 AM",
      cuisine: "American",
      image:
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      name: "Golden Fork",
      location: "Riverside Avenue",
      rating: "4.9",
      openingTime: "12:00 PM - 11:30 PM",
      cuisine: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) =>
      `${restaurant.name} ${restaurant.location} ${restaurant.cuisine}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleViewTables = (restaurant) => {
    const isLoggedIn = localStorage.getItem("isUserLoggedIn");

    if (!isLoggedIn) {
      sessionStorage.setItem(
        "loginMessage",
        "Please login to reserve a table"
      );
      navigate("/login");
      return;
    }

    navigate("/reservation", {
      state: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
    });
  };
  
  return (
    <div className="premium-homepage">
      <div className="home-content-wrapper">
        <section className="home-hero-section">
          <div className="home-hero-overlay">
            <div className="home-hero-content">
              <span className="hero-badge">TableMates Reservation Platform</span>
              <h1>Reserve the right table at the right restaurant.</h1>
              <p>
                TableMates helps diners explore restaurants, compare options, and
                reserve tables in a smooth and modern booking experience. From
                casual meals to premium dining, everything starts here.
              </p>

              <div className="home-hero-actions">
                <Link to="/login" className="hero-primary-btn">
                  Login
                </Link>
                <Link to="/signup" className="hero-secondary-btn">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-description-section">
          <div className="home-section-header centered-header">
            <span className="home-section-kicker">About TableMates</span>
            <h2>A smarter restaurant reservation experience</h2>
            <p>
              Our platform is designed for both customers and restaurant owners.
              Guests can quickly discover restaurants and reserve tables, while
              businesses can manage bookings and improve dining operations through
              a dedicated dashboard.
            </p>
          </div>

          <div className="home-description-grid">
            <div className="home-description-card">
              <h3>Discover Restaurants</h3>
              <p>
                Browse restaurants by name, location, and dining style with a
                clean searchable interface.
              </p>
            </div>

            <div className="home-description-card">
              <h3>Book with Confidence</h3>
              <p>
                Select your restaurant, choose your date and time, and complete a
                reservation in a few simple steps.
              </p>
            </div>

            <div className="home-description-card">
              <h3>Built for Businesses</h3>
              <p>
                Restaurant owners can manage reservations and control their
                restaurant operations more efficiently.
              </p>
            </div>
          </div>
        </section>

        <section className="home-search-section">
          <div className="home-section-header left">
            <span className="home-section-kicker">Search</span>
            <h2>Find your restaurant</h2>
            <p>Search by restaurant name, location, or cuisine.</p>
          </div>

          <div className="premium-search-box">
            <input
              type="text"
              className="premium-search-input"
              placeholder="Search restaurant by name, location, or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="home-restaurants-section">
          <div className="home-section-header left">
            <span className="home-section-kicker">Restaurant List</span>
            <h2>Available restaurants</h2>
            <p>Select a restaurant and continue to table reservation.</p>
          </div>

          <div className="premium-restaurant-list">
            {filteredRestaurants.length === 0 ? (
              <div className="premium-empty-state">
                <h3>No restaurants found</h3>
                <p>Try another search keyword.</p>
              </div>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <div className="premium-restaurant-card" key={restaurant.id}>
                  <div className="premium-restaurant-image-wrap">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="premium-restaurant-image"
                    />
                  </div>

                  <div className="premium-restaurant-content">
                    <div className="premium-restaurant-main">
                      <div className="premium-restaurant-topline">
                        <h3>{restaurant.name}</h3>
                        <span className="premium-rating">★ {restaurant.rating}</span>
                      </div>

                      <div className="premium-meta-row">
                        <span>{restaurant.cuisine}</span>
                        <span>{restaurant.location}</span>
                      </div>

                      <p className="premium-opening-time">
                        Opening Time: {restaurant.openingTime}
                      </p>
                    </div>

                    <div className="premium-restaurant-actions">
                      <button
                        type="button"
                        className="premium-view-btn"
                        onClick={() => handleViewTables(restaurant)}
                      >
                        View Tables
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-contact-section slim">
          <div className="premium-contact-inline">
            <div className="contact-left">
              <strong>Contact Us</strong>
              <span>We’re here to help with reservations and support.</span>
            </div>

            <div className="contact-right">
              <span>📞 +1 (555) 123-4567</span>
              <span>✉ contact@tablemates.com</span>
              <span>📍 City Center</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="premium-home-footer minimal">
        <p>© 2026 TableMates. Smart reservations. Better dining.</p>
      </footer>
    </div>
  );
}

export default Home;
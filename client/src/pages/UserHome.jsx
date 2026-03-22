import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userName = userEmail.split("@")[0];

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

  const handleLogout = () => {
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("userEmail");
    sessionStorage.clear();
    navigate("/");
  };

  const handleViewTables = (restaurant) => {
    navigate("/reservation", {
      state: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
    });
  };

  return (
    <div className="user-homepage">
      <section className="user-home-hero">
        <div className="user-home-hero-overlay">
          <div className="user-home-top">
            <div className="user-profile-card">
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <div>
                <span className="user-kicker">Customer Dashboard</span>
                <h1>Welcome back, {userName}</h1>
                <p>{userEmail}</p>
              </div>
            </div>

            <div className="user-home-actions">
              <button className="hero-secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="user-home-summary">
            <div className="user-summary-card">
              <h3>Account</h3>
              <p>Access your reservation journey and manage your dining flow.</p>
            </div>

            <div className="user-summary-card">
              <h3>Reserve Tables</h3>
              <p>Search restaurants and continue directly to available tables.</p>
            </div>

            <div className="user-summary-card">
              <h3>Easy Experience</h3>
              <p>Simple booking flow designed for real users and real restaurants.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="user-home-search-section">
        <div className="home-section-header left">
          <span className="home-section-kicker">Search</span>
          <h2>Find your next restaurant</h2>
          <p>Search restaurants by name, location, or cuisine.</p>
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
          <span className="home-section-kicker">Reserve Now</span>
          <h2>Available restaurants for you</h2>
          <p>Choose a restaurant and continue to reservation.</p>
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
    </div>
  );
}

export default UserHome;
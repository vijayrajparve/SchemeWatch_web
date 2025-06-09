import React from "react";

const MidDayMealPortal = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="d-flex justify-content-between align-items-center bg-white p-3 border-bottom">
        <img
          alt="Government of Maharashtra Logo"
          src="images/Mid-day_meal_scheme_logo.jpg"
          className="img-fluid"
          style={{ height: "80px" }}
        />
        <div className="text-center mx-3">
          <h5 className="m-0">प्रधानमंत्री पोषणशक्ती निर्माण योजना</h5>
          <small>सामाजिक अंके क्षेण (Social Audit) व मूल्यांकन सन २०२४-२५</small>
        </div>
        <img
          alt="Government of Maharashtra Emblem"
          src="images/lion_logo.jpg"
          className="img-fluid"
          style={{ height: "80px" }}
        />
      </header>

      {/* Main Banner Section */}
      <section className="bg-primary text-white text-center py-3">
        <h1>Mid Day Meal Portal</h1>
      </section>

      {/* Content Section */}
      <section className="d-flex flex-wrap justify-content-center align-items-center py-4 bg-light">
        <img
          alt="Children having mid day meal"
          src="images/children_img1.jpeg"
          className="img-fluid rounded shadow-lg"
          style={{ maxWidth: "50%" }}
        />
        <div className="login-box bg-white rounded p-4 shadow-lg mx-3">
          <div className="text-center mb-3">
            <img
              alt="Login Logo"
              src="images/login_logo.jpg"
              className="img-fluid"
              style={{ height: "60px" }}
            />
          </div>
          <h2 className="text-center mb-4">Login Here</h2>
          <div className="d-flex flex-column gap-2">
            <button className="btn btn-primary">Field Officer</button>
            <button className="btn btn-primary">Assistant Field Officer</button>
            <button className="btn btn-primary">Admin</button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-4 bg-white text-center">
        <div className="container d-flex flex-wrap justify-content-around">
          <div className="stat-item text-center mb-3">
            <img
              alt="School Icon"
              src="images/school_logo.jpg"
              className="img-fluid mb-2"
              style={{ height: "60px" }}
            />
            <h3>Total Mid Day Meal Schools (85269)</h3>
          </div>
          <div className="stat-item text-center mb-3">
            <h3>District (36)</h3>
          </div>
          <div className="stat-item text-center mb-3">
            <h3>Taluka (60)</h3>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center py-4 bg-light">
        <p className="m-0" style={{ fontFamily: "'Dancing Script', cursive" }}>
          "A nourished child is a nation's strength. When we feed young minds
          with love and wholesome meals, we empower a brighter, healthier, and
          more educated future for all."
        </p>
      </footer>
    </div>
  );
};

export default MidDayMealPortal;

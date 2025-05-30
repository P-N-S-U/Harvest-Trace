import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="d-flex align-items-center hero-section">
      <div className="container">
        <div className="row">
          {/* Left-aligned content */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h2 className="display-4 fw-bold text-success">
              Connecting Natural Farmers with Conscious Consumers
            </h2>
            <p className="lead text-muted fw-semibold">
              HarvestTrace is a transparent marketplace that verifies authentic
              natural farming practices and empowers consumers to make informed
              choices about their food.
            </p>
            <div className="mt-3">
              <Link
                to="/register"
                className="btn btn-success me-2 rounded-pill px-4 py-2 fw-bold"
              >
                Join as Farmer
              </Link>
              <a
                href="#"
                className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold bg-white"
              >
                Shop Products
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fix Spacing Issue */}
      <style>
        {`
          .hero-section {
            min-height: 100vh;
            padding-top: 60px; /* Ensure header does not overlap */
          }

          @media (max-width: 768px) {
            .hero-section {
              padding-top: 70px; /* Adjust for mobile */
              min-height: 5vh;
            //   margin-top: 5vh;
            }
            .container {
              margin-top: 5vh !important;
              padding-top: 0 !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;

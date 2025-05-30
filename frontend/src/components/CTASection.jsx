import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="text-black text-center py-5"
      style={{ background: "#f1fdf6" }}
    >
      <h2 className="display-4">Join Our Growing Community</h2>
      <p className="lead">
        Whether you're a natural farmer looking for fair markets or a consumer
        seeking authentic natural products, HarvestTrace connects you to a
        transparent food ecosystem.
      </p>
      <div className="mt-4">
        <button
          className="btn btn-success me-2"
          onClick={() => navigate("/register")}
        >
          Join as Farmer
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => navigate("/register")}
        >
          Shop as Consumer
        </button>
      </div>
    </section>
  );
};

export default CTASection;

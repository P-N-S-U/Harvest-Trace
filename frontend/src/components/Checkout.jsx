// src/components/Checkout.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/Checkout.css";
import {
  FaHome,
  FaBriefcase,
  FaTruck,
  FaShippingFast,
  FaStore,
} from "react-icons/fa";

const Checkout = () => {
  const [activeTab, setActiveTab] = useState("Delivery");
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [selectedDelivery, setSelectedDelivery] = useState("Standard Delivery");

  return (
    <div className="container my-5 p-4 shadow-lg rounded checkout-container bg-white">
      <div className="d-flex mb-4">
        <p>Home &gt; Account &gt; Checkout</p>
      </div>
      <h1 className="fw-bold mb-4">Checkout</h1>

      {/* Navigation Tabs */}

      {/* Delivery Address */}
      <div className="card p-3 mb-4">
        <h2 className="h5 fw-bold">Delivery Address</h2>
        <div
          className={`d-flex align-items-start mb-3 p-2 rounded ${
            selectedAddress === "Home" ? "bg-success text-white" : ""
          }`}
          onClick={() => setSelectedAddress("Home")}
          style={{ cursor: "pointer" }}
        >
          <FaHome className="fs-3 me-2" />
          <div>
            <p className="fw-semibold m-0">Home</p>
            <p>123 Main St, Apt 4B, Portland, OR 97201</p>
          </div>
        </div>
        <div
          className={`d-flex align-items-start p-2 rounded ${
            selectedAddress === "Work" ? "bg-success text-white" : ""
          }`}
          onClick={() => setSelectedAddress("Work")}
          style={{ cursor: "pointer" }}
        >
          <FaBriefcase className="fs-3 me-2" />
          <div>
            <p className="fw-semibold m-0">Work</p>
            <p>456 Business Ave, Suite 300, Portland, OR 97204</p>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="card p-3 mb-4">
        <h2 className="h5 fw-bold">Delivery Options</h2>
        <div
          className={`d-flex align-items-start mb-3 p-2 rounded ${
            selectedDelivery === "Standard Delivery"
              ? "bg-success text-white"
              : ""
          }`}
          onClick={() => setSelectedDelivery("Standard Delivery")}
          style={{ cursor: "pointer" }}
        >
          <FaTruck className="fs-3 me-2" />
          <div>
            <p className="fw-semibold m-0">Standard Delivery</p>
            <p>2-3 business days • $3.99</p>
          </div>
        </div>
        <div
          className={`d-flex align-items-start mb-3 p-2 rounded ${
            selectedDelivery === "Express Delivery"
              ? "bg-success text-white"
              : ""
          }`}
          onClick={() => setSelectedDelivery("Express Delivery")}
          style={{ cursor: "pointer" }}
        >
          <FaShippingFast className="fs-3 me-2" />
          <div>
            <p className="fw-semibold m-0">Express Delivery</p>
            <p>Next day delivery • $7.99</p>
          </div>
        </div>
        <div
          className={`d-flex align-items-start p-2 rounded ${
            selectedDelivery === "Pickup from Farm"
              ? "bg-success text-white"
              : ""
          }`}
          onClick={() => setSelectedDelivery("Pickup from Farm")}
          style={{ cursor: "pointer" }}
        >
          <FaStore className="fs-3 me-2" />
          <div>
            <p className="fw-semibold m-0">Pickup from Farm</p>
            <p>Schedule a pickup time • Free</p>
          </div>
        </div>
      </div>

      {/* Delivery Instructions */}
      <div className="card p-3 mb-4">
        <h2 className="h5 fw-bold">Delivery Instructions (Optional)</h2>
        <textarea
          className="form-control bg-light"
          rows="3"
          placeholder="Special instructions for delivery (e.g., Leave at door, Call upon arrival)"
        ></textarea>
      </div>

      {/* Order Summary */}
      <div className="card p-3 mb-4">
        <h2 className="h5 fw-bold">Order Summary</h2>
        <div className="d-flex justify-content-between">
          <p>Organic Tomatoes (2)</p>
          <p>$9.98</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Fresh Strawberries (1)</p>
          <p>$5.99</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Free-Range Eggs (1)</p>
          <p>$6.50</p>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <p>Subtotal</p>
          <p>$22.47</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Delivery</p>
          <p>$3.99</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>Tax</p>
          <p>$2.65</p>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold fs-5">
          <p>Total</p>
          <p>$29.11</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-3">
        <button className="btn btn-success btn-lg px-4 scale-hover">
          Back to Cart
        </button>
        <button className="btn btn-success btn-lg px-4 scale-hover">
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;

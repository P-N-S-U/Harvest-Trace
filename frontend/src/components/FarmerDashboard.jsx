import { useState } from "react";
import "./FarmerDashboard.css";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import MovableChatButton from "./MovableChatButton";

const FarmerDashboard = () => {
  const [orders] = useState([
    {
      id: "ORD001",
      customer: "John Smith",
      amount: "124.50",
      status: "Pending",
    },
    {
      id: "ORD002",
      customer: "Sarah Davis",
      amount: "228.25",
      status: "Completed",
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      amount: "78.85",
      status: "Processing",
    },
    {
      id: "ORD004",
      customer: "Emma Wilson",
      amount: "149.40",
      status: "Completed",
    },
  ]);
  const [totalOrders] = useState(45);
  const [pendingOrders] = useState(2);
  const [revenue] = useState("581.00");
  const [products] = useState(120);
  const [rating] = useState(4.5);

  return (
    <div className="container-fluid py-4 px-4">
      <DashboardOverview
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        revenue={revenue}
        products={products}
        rating={rating}
      />
      <div className="row mt-4">
        <div className="col-md-7">
          <RecentOrders orders={orders} />
        </div>
        <div className="col-md-5">
          <SalesChartCard />
        </div>
      </div>
      <Products />
      <Orders />
    </div>
  );
};

const Orders = () => {
  const orders = [
    { id: 1, product: "Tender Coconut", quantity: 2, total: 80 },
    { id: 2, product: "Tomatoes", quantity: "1kg", total: 110 },
    { id: 3, product: "WaterMelon", quantity: 3, total: 300 },
  ];

  return (
    <div className="bg-white rounded shadow p-4 mb-4 mt-4">
      <MovableChatButton />
      <h2 className="fs-5 fw-bold text-dark mb-3">Incoming Orders</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>₹{order.total}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    View
                  </button>
                  <button className="btn btn-sm btn-outline-success">
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardOverview = ({
  totalOrders,
  pendingOrders,
  revenue,
  products,
  rating,
}) => {
  return (
    <div
      className="bg-white rounded shadow p-4 mb-4 container-fluid"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
        backdropFilter: "blur(10px)",
        marginTop: "6rem",
        borderLeft: "4px solid #4270cd",
      }}
    >
      <h1 className="fs-4 fw-bold text-dark mb-3">Dashboard Overview</h1>
      <div className="row g-3">
        <div className="col-md-3 col-sm-6">
          <div className="border rounded p-3 h-100 dashboard-stat">
            <div className="small text-secondary text-uppercase fw-medium">
              Total Orders
            </div>
            <div className="d-flex align-items-center mt-2">
              <span className="fs-3 fw-bold">{totalOrders}</span>
              <span className="ms-2 badge status-pending">
                {pendingOrders} pending
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="border rounded p-3 h-100 dashboard-stat">
            <div className="small text-secondary text-uppercase fw-medium">
              Revenue
            </div>
            <div className="fs-3 fw-bold mt-2">₹{revenue}</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="border rounded p-3 h-100 dashboard-stat">
            <div className="small text-secondary text-uppercase fw-medium">
              Products
            </div>
            <div className="fs-3 fw-bold mt-2">{products}</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="border rounded p-3 h-100 dashboard-stat">
            <div className="small text-secondary text-uppercase fw-medium">
              Ratings
            </div>
            <div className="d-flex align-items-center mt-2">
              <span className="fs-3 fw-bold">{rating}</span>
              <span className="ms-2 text-warning">★★★★½</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesChart = ({ salesData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById("salesChart").getContext("2d");

    // Destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart instance
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Sales",
            data: salesData,
            borderColor: "#4270cd",
            backgroundColor: "rgba(66, 112, 205, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#4270cd",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [salesData]);

  return <canvas id="salesChart" height="250"></canvas>;
};

const SalesChartCard = () => {
  const [salesData] = useState([12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 15]);

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="fs-5 fw-bold text-dark mb-3">Monthly Sales Performance</h2>
      <div style={{ height: "250px" }}>
        <SalesChart salesData={salesData} />
      </div>
    </div>
  );
};

const RecentOrders = ({ orders }) => {
  const getStatusClass = (status) => {
    const classes = {
      Pending: "status-pending",
      Completed: "status-completed",
      Processing: "status-processing",
    };
    return classes[status] || "bg-secondary text-white";
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="fs-5 fw-bold text-dark mb-3">Recent Orders</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-uppercase small fw-medium text-secondary">
                Order ID
              </th>
              <th className="text-uppercase small fw-medium text-secondary">
                Customer
              </th>
              <th className="text-uppercase small fw-medium text-secondary">
                Amount
              </th>
              <th className="text-uppercase small fw-medium text-secondary">
                Status
              </th>
              <th className="text-uppercase small fw-medium text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="small">{order.id}</td>
                <td className="small">{order.customer}</td>
                <td className="small">₹{order.amount}</td>
                <td>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescript, setProductDescript] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      name: productName,
      price: productPrice,
      Description: productDescript,
      weight: productWeight,
      status: productStatus,
      quantity: productQuantity,
      soldby: "Bio Coders",
      image: productImage ? URL.createObjectURL(productImage) : null,
    };

    setProducts([...products, newProduct]);
    // Reset states
    setProductName("");
    setProductPrice("");
    setProductDescript("");
    setProductWeight("");
    setProductStatus("");
    setProductQuantity("");
    setProductImage(null);
    setShowForm(false); // Hide form after submission
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-5 fw-bold text-dark mb-0">Manage Products</h2>
        <button
          className={`btn ${showForm ? "btn-danger" : "btn-primary"}`}
          onClick={toggleForm}
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <h3 className="fs-5 mb-3">Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Product Description</label>
                <textarea
                  className="form-control"
                  value={productDescript}
                  onChange={(e) => setProductDescript(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product Status</label>
                  <select
                    className="form-select"
                    value={productStatus}
                    onChange={(e) => setProductStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre-order">Pre-order</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product Weight (KG)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={productWeight}
                    onChange={(e) => setProductWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileUpload}
                  accept="image/*"
                  required
                />
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{product.name}</h5>
                    <span className="badge bg-primary">₹{product.price}</span>
                  </div>
                  <p className="card-text text-muted small">
                    {product.Description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center small">
                    <span>
                      <strong>Weight:</strong> {product.weight} KG
                    </span>
                    <span>
                      <strong>Qty:</strong> {product.quantity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`badge ${
                        product.status === "Available"
                          ? "bg-success"
                          : product.status === "Limited"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : showForm ? null : (
        <div className="text-center py-5">
          <div className="mb-3">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#adb5bd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3 className="fs-5 text-muted">No products available</h3>
          <p className="text-muted">
            Click the "Add Product" button to add your first product
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;

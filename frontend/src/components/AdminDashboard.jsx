import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Eye,
  MoreVertical,
  ShieldCheck,
  Vegan,
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);



  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Track which requests are successful and which fail
        const results = {
          stats: null,
          pendingFarmers: null,
          consumers: null,
          orders: null,
          products: null,
        };

        try {
          // ✅ Fetch dashboard statistics
          const statsRes = await axios.get("http://localhost:5000/ObviouslyNotAdmin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.stats = statsRes.data;
          setDashboardStats(statsRes.data);
        } catch (err) {
          console.error("Failed to fetch stats:", err.message);
        }

        try {
          // ✅ Fetch pending verifications
          const farmersRes = await axios.get("http://localhost:5000/ObviouslyNotAdmin/pending-farmers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.pendingFarmers = farmersRes.data;
          setVerifications(farmersRes.data);
        } catch (err) {
          console.error("Failed to fetch pending farmers:", err.message);
        }

        try {
          // ✅ Fetch all consumers
          const consumersRes = await axios.get("http://localhost:5000/ObviouslyNotAdmin/consumers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.consumers = consumersRes.data;
          setConsumers(consumersRes.data);
        } catch (err) {
          console.error("Failed to fetch consumers:", err.message);
        }

        try {
          // ✅ Fetch all orders
          const ordersRes = await axios.get("http://localhost:5000/orders/all", {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.orders = ordersRes.data;
          setOrders(ordersRes.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err.message);
        }

        try {
          // ✅ Fetch all products
          const productsRes = await axios.get("http://localhost:5000/products/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.products = productsRes.data;
          setProducts(productsRes.data);
        } catch (err) {
          console.error("Failed to fetch products:", err.message);
        }

        // Log the overall results to help diagnose which requests failed
        console.log("API request results:", results);

        // Set error state only if all requests failed
        const allFailed = Object.values(results).every(result => result === null);
        if (allFailed) {
          setError("Failed to load all data. Check your network connection and API server.");
        }

      } catch (error) {
        console.error("Dashboard Error:", error);
        setError("Failed to load data: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleApprove = async (id) => {
    console.log("Approving ID:", id); // Debugging line
    console.log("Type of ID:", typeof id);
    try {
      await axios.post(`http://localhost:5000/ObviouslyNotAdmin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerifications(verifications.filter(farmer => farmer._id !== id));
    } catch (error) {
      console.error("Approval Error:", error);
    }
  };


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div
      className="d-flex container-fluid"
      style={{
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginTop: "10vh" }}>
        <h2 className="fw-bold text-dark mb-4">Dashboard Overview</h2>

        {/* Dashboard Stats Cards */}
        <div className="row g-4 mb-4">
          {[
            {
              label: "Verified Farmers",
              value: dashboardStats?.verifiedFarmers || 0,
              icon: <Users size={32} />,
              color: "#01c64b",
            },
            {
              label: "Active Consumers",
              value: dashboardStats?.totalConsumers || 0,
              icon: <Package size={32} />,
              color: "#007bff",
            },
            {
              label: "All Orders",
              value: dashboardStats?.totalOrders || 0,
              icon: <ShoppingCart size={32} />,
              color: "#ffc107",
            },
            {
              label: "All Listed Products",
              value: dashboardStats?.totalProducts || 0,
              icon: <Vegan size={32} />,
              color: "#17a2b8",
            },
          ].map((stat, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div
                className="card shadow-sm border-0 text-white p-4 rounded-3"
                style={{ background: stat.color }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="small mb-1">{stat.label}</p>
                    <h3 className="fw-bold">{stat.value}</h3>
                  </div>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Verifications Table */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h3 className="fw-bold text-dark mb-3">Pending Verifications</h3>

          {/* Scrollable Table Wrapper */}
          <div
            className="table-responsive"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <table className="table h-2">
              <thead
                className="bg-light position-sticky top-0"
                style={{ zIndex: 2 }}
              >
                <tr>
                  <th>Farmer Name</th>
                  <th>Location</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifications.length > 0 ? (
                  verifications.map((verification) => (
                    <tr key={verification._id || verification.id}>
                      <td>{verification.name || verification.farmerName || "N/A"}</td>
                      <td>{verification.address || "N/A"}</td>
                      <td>{verification.createdAt || verification.submitted || "N/A"}</td>
                      <td>
                        <span className="badge bg-warning">
                          {verification.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleViewDocuments(verification)} className="btn btn-outline-dark btn-sm me-2">
                          <Eye size={16} />
                        </button>
                        <button onClick={()=>handleApprove(verification._id)} className="btn btn-outline-dark btn-sm">
                          <ShieldCheck size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No pending verifications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h3 className="fw-bold text-dark mb-3">All Consumers</h3>

          {/* Scrollable Table Wrapper */}
          <div
            className="table-responsive"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <table className="table h-2">
              <thead
                className="bg-light position-sticky top-0"
                style={{ zIndex: 2 }}
              >
                <tr>
                  <th>User Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone no</th>
                </tr>
              </thead>
              <tbody>
                {consumers.length > 0 ? (
                  consumers.map((consumer) => (
                    <tr key={consumer._id || consumer.id}>
                      <td>{consumer._id || consumer.id || "N/A"}</td>
                      <td>{consumer.name || consumer.ConsumerName || "N/A"}</td>
                      <td>{consumer.email || consumer.ConsumerEmail || "N/A"}</td>
                      <td>{consumer.phone || consumer.PhoneNo || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No consumers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h3 className="fw-bold text-dark mb-3">All Orders</h3>
          {/* Scrollable Table Wrapper */}
          <div
            className="table-responsive"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <table className="table h-2">
              <thead
                className="bg-light position-sticky top-0"
                style={{ zIndex: 2 }}
              >
                <tr>
                  <th>Order Id</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Total Price</th>
                  <th>Status</th>

                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id || order.id}>
                      <td>{order._id || order.id || "N/A"}</td>
                      <td>{order.product?.name || (typeof order.product === 'string' ? order.product : "N/A")}</td>
                      <td>
                        {order.consumer?.name ||
                          (typeof order.consumer === 'string' ? order.consumer : "N/A")}
                      </td>
                      <td>
                        {order.totalPrice ? `₹${order.totalPrice.toFixed(2)}` : "N/A"}
                      </td>
                      <td>
                        <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h3 className="fw-bold text-dark mb-3">All listed Products</h3>

          {/* Scrollable Table Wrapper */}
          <div
            className="table-responsive"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <table className="table h-2">
              <thead
                className="bg-light position-sticky top-0"
                style={{ zIndex: 2 }}
              >
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Farmer</th>
                  <th>Price</th>
                  <th>Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id || product.id}>
                      <td>{product._id || product.id || "N/A"}</td>
                      <td>{product.name || "N/A"}</td>
                      <td>
                        {product.farmer?.name ||
                          (typeof product.farmer === 'string' ? product.farmer : "N/A")}
                      </td>
                      <td>
                        {product.price ? `₹${product.price.toFixed(2)}` : "N/A"}
                      </td>
                      <td>{product.quantity || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
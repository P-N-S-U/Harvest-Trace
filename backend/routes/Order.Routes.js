const express = require("express");
const Order = require("../models/Order.model");
const Product = require("../models/products.model");
const Consumer = require("../models/Consumers.model");
const { protect, consumerOnly, farmerOnly, adminOnly } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const PDFDocument = require("pdfkit");

const router = express.Router();

/**  
 *  Place a New Order  
 *  `POST /api/orders`
 *  Only consumers can place orders
 */
router.post("/", protect, consumerOnly, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    let totalPrice = 0;
    let orderItems = [];

    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      totalPrice += product.price * item.quantity;

      // 🔹 Store farmer ID along with the product in the order
      orderItems.push({
        product: product._id,
        farmer: product.farmer, // ✅ Add farmer reference
        quantity: item.quantity
      });
    }

    const order = new Order({
      consumer: req.Consumer.id,
      products: orderItems, // ✅ Now contains farmer ID
      totalPrice
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


/**  
 *  Get Orders of a Consumer  
 *  `GET /api/orders/my-orders`
 *  Only the logged-in consumer can see their orders
 */
router.get("/my-orders", protect, consumerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user.id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  
 *  Get Orders for Farmers (Products They Sold)  
 *  `GET /api/orders/farmer-orders`
 *  Only farmers can see orders that contain their products
 */
router.get("/farmer-orders", protect, farmerOnly, async (req, res) => {
  try {
    // Fetch orders that contain products linked to the logged-in farmer
    const orders = await Order.find({ "products.farmer": req.user.id })
      .populate("products.product")
      .populate("consumer", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


/**  
 *  Update Order Status (Farmer Processing Order)  
 *  `PUT /api/orders/:orderId`
 *  Only farmers can update order status
 */
// router.put("/:orderId", protect, farmerOnly, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.orderId).populate("farmer");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//      if (!order.farmer) {
//       return res.status(400).json({ message: "Farmer data missing for this order" });
//     }

//     res.json(order);

//     if (!farmerOwnsProduct) {
//       return res.status(403).json({ message: "You cannot update this order" });
//     }

//     order.status = status;
//     await order.save();

//     res.json({ message: "Order status updated", order });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// });

router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    // Fetch all orders, including consumer details and product details
    const orders = await Order.find()
      .populate("consumer", "name email") // Include consumer details
      .populate({
        path: "products.product",
        populate: { path: "farmer", select: "name email" } // Include farmer details
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});



router.get("/:orderId/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("consumer", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create PDF document
    const doc = new PDFDocument();
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.text(`Invoice for Order ID: ${order._id}`);
    doc.text(`Customer: ${order.consumer.name} (${order.consumer.email})`);
    doc.text(`Total Price: $${order.totalPrice}`);
    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/test-connection", async (req, res) => {
  try {
    // Test database connection
    const connectionState = mongoose.connection.readyState;
    const connectionStatus = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    
    return res.json({
      databaseConnection: connectionStatus[connectionState] || "unknown",
      message: "Connection test route"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add this to check if your order ID is valid
router.get("/validate-id/:orderId", (req, res) => {
  const { orderId } = req.params;
  const isValid = mongoose.Types.ObjectId.isValid(orderId);
  
  return res.json({
    orderId,
    isValid,
    message: isValid ? "Order ID is valid" : "Order ID is invalid"
  });
});

// Add this endpoint to your orders routes file
// Clear route for getting a specific order
router.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log("Fetching order with ID:", orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid Order ID format" });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "products.product",
        select: "name price imageUrl",
      })
      .populate("consumer", "name email phone");

    if (!order) {
      console.log("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order found:", order);

    // Extract farmer details - assuming all products have the same farmer
    const farmerId = order.products[0]?.farmer;
    let farmer = null;

    if (farmerId) {
      farmer = await mongoose.model("Farmer").findById(farmerId)
        .select("name address latitude longitude badges owner");
    }

    // Format the response data to match what your frontend expects
    const response = {
      orderId: order._id,
      orderDate: order.createdAt,
      totalAmount: order.totalPrice,
      subtotal: order.totalPrice - 8.49, // Adjust calculation as needed
      shipping: 5.99,
      tax: 2.50,
      status: order.status,
      products: order.products.map((p) => ({
        id: p.product?._id || p.product,
        name: p.product?.name || "Product",
        price: p.product?.price || 0,
        image: p.product?.imageUrl || "/placeholder.jpg",
        quantity: p.quantity,
      })),
      farmer: farmer ? {
        name: farmer.name || "Local Farm",
        owner: farmer.owner || "Farm Owner",
        address: farmer.address || "123 Farm Road",
        latitude: farmer.latitude || 40.7128,
        longitude: farmer.longitude || -74.0060,
        badges: farmer.badges || ["Organic", "Local"],
        distance: "12.5 miles"
      } : {
        name: "Local Farm",
        owner: "Farm Owner",
        address: "123 Farm Road",
        latitude: 40.7128,
        longitude: -74.0060,
        badges: ["Organic", "Local"],
        distance: "12.5 miles"
      },
      payment: {
        method: "Credit Card",
        cardNumber: "**** **** **** 4242"
      },
      steps: [
        { id: 1, title: "Order Placed", date: new Date().toLocaleDateString(), isActive: true },
        { id: 2, title: "Processing", date: "Pending", isActive: false },
        { id: 3, title: "Ready for Pickup", date: "Pending", isActive: false },
        { id: 4, title: "Completed", date: "Pending", isActive: false }
      ]
    };

    console.log("Sending response:", response);
    return res.json(response);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});



module.exports = router;

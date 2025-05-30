import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  // Fetch cart items from backend on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Function to fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      // Get token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to view cart');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5000/consumer/cart', config);

      // Transform backend data structure to match our frontend structure
      const transformedCartItems = response.data.map(item => {
        const unitPrice = item.product.price;
        const unitOriginalPrice = item.product.originalPrice || Math.round(unitPrice * 1.04);
        const quantity = item.quantity || 1;

        return {
          id: item.product._id,
          name: item.product.name,
          size: item.product.size || 'Standard',
          seller: item.product.seller || 'FreshFarm',
          verified: item.product.verified || true,
          unitPrice: unitPrice, // Store the unit price for later calculations
          price: unitPrice * quantity, // Total price for this item
          unitOriginalPrice: unitOriginalPrice, // Store the unit original price
          originalPrice: unitOriginalPrice * quantity, // Total original price
          discount: `${Math.round(((unitOriginalPrice - unitPrice) / unitOriginalPrice) * 100)}% off`,
          offersAvailable: item.product.offersAvailable || 1,
          deliveryBy: item.product.deliveryBy || 'Tomorrow',
          imageUrl: item.product.imageUrl || '/api/placeholder/150/150',
          images: item.product.images || ['/api/placeholder/150/150', '/api/placeholder/150/150', '/api/placeholder/150/150'],
          quantity: quantity
        };
      });

      setCartItems(transformedCartItems);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart items');
      setLoading(false);
    }
  };

  // Function to update cart item quantity in backend
  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to update cart');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('http://localhost:5000/consumer/cart/add',
        { productId, quantity: quantity },
        config
      );

      // Refetch cart to get updated data
      // fetchCartItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating cart item');
    }
  };

  // Function to handle quantity change in UI
  const handleQuantityChange = (id, increment) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = increment ? (item.quantity || 1) + 1 : Math.max(1, (item.quantity || 1) - 1);

        // Use the unit prices to calculate the new totals
        const newPrice = item.unitPrice * newQuantity;
        const newOriginalPrice = item.unitOriginalPrice * newQuantity;

        // Update quantity in backend
        updateCartItemQuantity(id, increment ? 1 : -1);

        return {
          ...item,
          quantity: newQuantity,
          price: Math.round(newPrice),
          originalPrice: Math.round(newOriginalPrice)
        };
      }
      return item;
    }));
  };

  // Function to remove item from cart (both UI and backend)
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to remove items');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Update the quantity to 0 to effectively remove it
      await axios.post('http://localhost:5000/consumer/cart/add',
        { productId: id, quantity: -cartItems.find(item => item.id === id).quantity },
        config
      );

      // Update UI immediately
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing cart item');
    }
  };

  // Dynamic calculation of price details
  const calculatePriceDetails = () => {
    const totalOriginalPrice = cartItems.reduce((total, item) => total + item.originalPrice, 0);
    const totalDiscountedPrice = cartItems.reduce((total, item) => total + item.price, 0);
    const totalDiscount = totalOriginalPrice - totalDiscountedPrice;
    const platformFee = 5;
    const deliveryCharges = 0; // FREE
    const totalAmount = totalDiscountedPrice + platformFee + deliveryCharges;
    const totalSavings = totalDiscount;

    return {
      originalPrice: totalOriginalPrice,
      discountedPrice: totalDiscountedPrice,
      discount: totalDiscount,
      platformFee,
      deliveryCharges,
      totalAmount,
      totalSavings
    };
  };

  // Calculate price details
  const priceDetails = calculatePriceDetails();

  // Handle place order
  const handlePlaceOrder = () => {
    // You can implement order placement functionality here
    alert('Order placed successfully!');
    Navigate('/payment');
  };

  // Main container style with fixed 90% width and centered
  const mainContainerStyle = {
    width: '90%',
    maxWidth: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '100px',
    padding: '0',
    boxSizing: 'border-box'
  };

  if (loading) {
    return (
      <div style={mainContainerStyle} className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={mainContainerStyle} className="py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-outline-success"
          onClick={fetchCartItems}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      <div className="row my-3">
        <div className="col-12">
          <h2 className="text-success">My Cart ({cartItems.length})</h2>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card mb-3">
          <div className="card-body text-center py-5">
            <h4>Your cart is empty</h4>
            <p className="text-muted">Add some items to your cart and they will appear here.</p>
            <button className="btn btn-success">Continue Shopping</button>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-lg-8">
              {/* Delivery Address */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Deliver to: John Doe, 421503</strong>
                      <div>123 Farm Lane, Green Garden, Farmville</div>
                    </div>
                    <button className="btn btn-outline-success">Change</button>
                  </div>
                </div>
              </div>

                {/* Cart Items */}
                {cartItems.map(item => (
                  <div className="card mb-3" key={item.id}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <img
                            className="d-block w-100"
                            src={item.imageUrl}
                            alt={item.name}
                          />
                        </div>
                        <div className="col-md-9">
                          <h5>{item.name}</h5>
                          <p className="mb-1">Size: {item.size}</p>
                          <p className="mb-2">
                            Seller: {item.seller}
                            {item.verified &&
                              <span className="badge bg-success text-white ms-2">Verified</span>
                            }
                          </p>
                          <div className="d-flex align-items-center mb-2">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => handleQuantityChange(item.id, false)}
                            >
                              −
                            </button>
                            <span className="border px-3 py-1">{item.quantity || 1}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary ms-2"
                              onClick={() => handleQuantityChange(item.id, true)}
                            >
                              +
                            </button>
                          </div>
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0 me-2">₹{item.price}</h6>
                            <span className="text-decoration-line-through text-muted me-2">₹{item.originalPrice}</span>
                            <span className="text-success">{item.discount}</span>
                            <span className="badge bg-success text-white ms-2">
                              {item.offersAvailable} offers available
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-success">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Delivery by {item.deliveryBy}
                            </span>
                            <div className="mt-2">
                              <button
                                className="btn btn-sm btn-outline-danger me-2"
                                onClick={() => removeItem(item.id)}
                              >
                                <i className="bi bi-trash me-1"></i> REMOVE
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="bi bi-heart me-1"></i> SAVE FOR LATER
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>

            <div className="col-lg-4">
              {/* Price Details */}
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="mb-0">PRICE DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{priceDetails.originalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>− ₹{priceDetails.discount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Platform Fee</span>
                    <span>₹{priceDetails.platformFee}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Delivery Charges</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="mb-0">Total Amount</h6>
                    <h6 className="mb-0">₹{priceDetails.totalAmount}</h6>
                  </div>
                  <hr />
                  <div className="text-success mb-3">
                    You will save ₹{priceDetails.totalSavings} on this order
                  </div>

                  <div className="card-body border rounded mb-3">
                    <h6>Safe and Secure Payments</h6>
                    <p className="text-muted mb-0">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Easy returns. 100% Authentic products.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-8">
              <button className="btn btn-success w-100 py-2" onClick={handlePlaceOrder}>
                PLACE ORDER
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Ensure Leaflet CSS is imported
import 'leaflet/dist/leaflet.css';

// Main component that contains everything
const PaymentConfirmation = ({ orderId }) => {
  const [isMapInteractive, setIsMapInteractive] = useState(false);  // State to toggle interactivity
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmerLocation, setFarmerLocation] = useState(null);
  const navigate = useNavigate();

  // Function to fetch order data from backend
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);

        // Replace with your actual API endpoint
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch order data: ${response.status}`);
        }

        const data = await response.json();
        setOrderData(data);

        // Process farmer location if it's in string format
        if (data.farmer && data.farmer.locationString) {
          const coordinates = convertLocationStringToCoordinates(data.farmer.locationString);
          setFarmerLocation(coordinates);
        } else if (data.farmer && data.farmer.mapLocation) {
          // If backend already provides lat/lng
          setFarmerLocation({
            lat: data.farmer.mapLocation.lat,
            lng: data.farmer.mapLocation.lng
          });
        }
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    } else {
      // Use mock data for testing when orderId is not provided
      setOrderData(mockOrderData);
      setFarmerLocation({
        lat: mockOrderData.farmer.mapLocation.lat,
        lng: mockOrderData.farmer.mapLocation.lng
      });
      setIsLoading(false);
    }
  }, [orderId]);

  // Function to convert location string to coordinates
  const convertLocationStringToCoordinates = (locationString) => {
    // This function needs to be implemented based on your string format
    // Option 1: If your string format is "lat,lng" (e.g., "33.9806,-117.3755")
    if (locationString.includes(',')) {
      const [lat, lng] = locationString.split(',').map(coord => parseFloat(coord.trim()));
      return { lat, lng };
    }

    // Option 2: If you need to geocode an address (e.g., "Riverside County, CA")
    // In production, you'd want to do this server-side to protect API keys
    // This is a simplified example - in real implementation you would use a geocoding service

    // For now, return default coordinates if parsing fails
    console.warn("Could not parse location string:", locationString);
    return { lat: 33.9806, lng: -117.3755 }; // Default coordinates
  };

  // Custom CSS
  const styles = {
    logo: {
      color: '#2e7d32',
      fontWeight: 'bold'
    },
    card: {
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: 'none'
    },
    mapContainer: {
      height: '300px',
      overflow: 'hidden',
      borderRadius: '8px'
    },
    mapWrapper: {
      position: 'relative',
      height: '300px',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    stepCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    activeStep: {
      backgroundColor: '#2e7d32',
      color: 'white'
    },
    inactiveStep: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    },
    stepConnector: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '2px',
      backgroundColor: '#e0e0e0',
      zIndex: 1,
      transform: 'translateY(-50%)'
    },
    badge: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      marginRight: '0.5rem',
      fontSize: '0.75rem'
    },
    farmerAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      marginRight: '15px'
    },
    productImage: {
      width: '60px',
      height: '60px',
      backgroundColor: '#f0f0f0',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    primaryButton: {
      backgroundColor: '#2e7d32',
      borderColor: '#2e7d32',
      padding: '0.5rem 1.5rem'
    },
    secondaryButton: {
      color: '#2e7d32',
      borderColor: '#2e7d32',
      padding: '0.5rem 1.5rem'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px'
    }
  };

  // Function to activate the map's interactivity
  const handleMapClick = () => {
    setIsMapInteractive(true);
  };
  const handleshopping = (e) => {
    e.preventDefault();
    navigate("/marketplace");
  };

  // Mock data used for testing
  const mockOrderData = {
    orderId: 'FF-234567',
    orderDate: 'March 22, 2025, 2:30 PM',
    totalAmount: 29.02,
    subtotal: 22.25,
    shipping: 4.99,
    tax: 1.78,
    products: [
      {
        id: 1,
        name: 'Organic Tomatoes',
        quantity: '2 kg',
        price: 12.00,
        image: '/placeholder/80/80'
      },
      {
        id: 2,
        name: 'Fresh Basil',
        quantity: '1 bunch',
        price: 3.50,
        image: '/placeholder/80/80'
      },
      {
        id: 3,
        name: 'Free-Range Eggs',
        quantity: '12 count',
        price: 6.75,
        image: '/placeholder/80/80'
      }
    ],
    farmer: {
      name: 'Green Valley Farms',
      owner: 'John Peterson',
      distance: '12.5 miles away',
      location: 'Riverside County, CA',
      locationString: '33.9806,-117.3755', // String format from backend
      badges: ['Organic', 'Local'],
      mapLocation: {
        lat: 33.9806,
        lng: -117.3755
      }
    },
    payment: {
      method: 'Credit Card',
      cardNumber: '•••• •••• •••• 4567'
    },
    steps: [
      { id: 1, title: 'Order Placed', date: 'Today, 2:30 PM', isActive: true },
      { id: 2, title: 'Harvest & Pack', date: 'Est. Mar 23', isActive: false },
      { id: 3, title: 'Shipping', date: 'Est. Mar 24', isActive: false },
      { id: 4, title: 'Delivery', date: 'Est. Mar 25', isActive: false }
    ]
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div style={styles.loadingContainer}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <h4>Error Loading Order</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <Container  className="py-4 backdropfilter-blur">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center py-3 border-bottom mb-4">
        <div className="h4 mb-0" style={styles.logo}>Farm Fresh Connect</div>
        <div>Order #{orderData.orderId}</div>
      </header>

      {/* Confirmation Banner */}
      <Alert variant="success" className="mb-4">
        <h4 className="alert-heading">Thank you for your purchase!</h4>
        <p className="mb-0">Your order has been successfully placed and the farmer has been notified.</p>
      </Alert>

      {/* Farmer Map */}
      {farmerLocation && (
        <Card className="mb-4" style={styles.card}>
          <div style={styles.mapWrapper} onClick={handleMapClick}>
            <div className="position-absolute top-0 end-0 bg-white m-2 p-2 rounded shadow-sm" style={{ zIndex: 1000 }}>
              <small className="fw-bold">Farm Location</small>
              <div>
                <small>{orderData.farmer.location}</small>
              </div>
            </div>
            {/* Leaflet Map */}
            <MapContainer
              center={[farmerLocation.lat, farmerLocation.lng]}
              zoom={13}
              style={styles.mapContainer}
              whenCreated={(map) => {
                // Disable interactivity initially
                if (!isMapInteractive) {
                  map.dragging.disable();
                  map.touchZoom.disable();
                  map.scrollWheelZoom.disable();
                  map.boxZoom.disable();
                  map.keyboard.disable();
                }
              }}
              zoomControl={false}
              interactive={isMapInteractive}  // Make the map interactive once clicked
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[farmerLocation.lat, farmerLocation.lng]}
                icon={new L.Icon({
                  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>{orderData.farmer.name} - {orderData.farmer.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>
      )}

      {/* Order Steps */}
      <div className="mb-4">
        <Row className="g-0 position-relative">
          {orderData.steps.map((step, index) => (
            <Col key={step.id} className="position-relative">
              {/* Connector line */}
              {index < orderData.steps.length - 1 && (
                <div style={styles.stepConnector}></div>
              )}

              {/* Step circle */}
              <div className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                <div style={{
                  ...styles.stepCircle,
                  ...(step.isActive ? styles.activeStep : styles.inactiveStep)
                }} className="mb-2">
                  {step.id}
                </div>
                <div className="text-center">
                  <div className="fw-bold small">{step.title}</div>
                  <div className="text-muted smaller">{step.date}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Order Details */}
      <Row className="g-4 mb-4">
        {/* Order Summary */}
        <Col lg={6}>
          <Card className="h-100" style={styles.card}>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-success">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {orderData.products.map(product => (
                  <ListGroup.Item key={product.id} className="px-0 py-3 border-bottom">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <div style={styles.productImage}>
                          <img
                            src={`/api${product.image}`}
                            alt={product.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="fw-bold">{product.name}</div>
                        <div className="d-flex justify-content-between text-muted small">
                          <span>{product.quantity}</span>
                          <span>${product.price.toFixed(2)}</span>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold">${orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Tax</span>
                  <span className="fw-bold">${orderData.tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-3 mt-2">
                  <span className="h5 mb-0">Total</span>
                  <span className="h5 mb-0 text-success">${orderData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Farmer & Payment Info */}
        <Col lg={6}>
          <Card className="h-100" style={styles.card}>
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 text-success">Farmer & Payment Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div style={styles.farmerAvatar}></div>
                <div>
                  <div className="fw-bold">{orderData.farmer.name}</div>
                  <div className="small text-muted">{orderData.farmer.owner}</div>
                  <div className="mt-1">
                    {orderData.farmer.badges.map((badge, index) => (
                      <span key={index} style={styles.badge}>{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Row className="border-bottom py-2">
                  <Col xs={6} className="text-muted">Farm Distance</Col>
                  <Col xs={6} className="text-end fw-bold">{orderData.farmer.distance}</Col>
                </Row>
                <Row className="border-bottom py-2">
                  <Col xs={6} className="text-muted">Farm Location</Col>
                  <Col xs={6} className="text-end fw-bold">{orderData.farmer.location}</Col>
                </Row>
              </div>

              <h5 className="text-success mt-4 mb-3">Payment Method</h5>
              <Row className="border-bottom py-2">
                <Col xs={6} className="text-muted">Method</Col>
                <Col xs={6} className="text-end fw-bold">{orderData.payment.method}</Col>
              </Row>
              <Row className="border-bottom py-2">
                <Col xs={6} className="text-muted">Card</Col>
                <Col xs={6} className="text-end fw-bold">{orderData.payment.cardNumber}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button onClick={()=>handleshopping} variant="outline-success" style={styles.secondaryButton}>Continue Shopping</Button>
        <Button variant="success" style={styles.primaryButton}>Contact Farmer</Button>
      </div>
    </Container>
  );
};

export default PaymentConfirmation;
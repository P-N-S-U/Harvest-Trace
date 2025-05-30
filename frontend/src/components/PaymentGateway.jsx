"use client";

import { useState } from "react";
import {
  BsCreditCard2Front,
  BsCash,
  BsQrCode,
  BsCheckCircle,
  BsInfoCircle,
  BsCreditCard2Back,
} from "react-icons/bs";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";

const PaymentGateway = ({ onSubmitPayment }) => {
  // Full form state for all payment-related data
  const [formData, setFormData] = useState({
    // Payment method information
    paymentMethod: "",

    // Card payment details
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",

    // COD details
    deliveryInstructions: "",

    // UPI details
    upiReference: "",

    // Order information
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
    orderDate: new Date().toISOString(),
    subtotal: 899.0,
    shipping: 50.0,
    tax: 45.0,
    total: 994.0,

    // Product information
    product: {
      name: "Organic Fresh Produce Bundle",
      image: "/placeholder.svg",
      price: 899.0,
      originalPrice: 1099.0,
      discount: 18,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle all form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: method,
    }));
  };

  // Validate form based on payment method
  const validateForm = () => {
    const newErrors = {};

    // Validate payment method specific fields
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber)
        newErrors.cardNumber = "Card number is required";
      if (!formData.cardName)
        newErrors.cardName = "Cardholder name is required";
      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for enabling/disabling the submit button
  const isFormValid = () => {
    // Payment method validation
    if (!formData.paymentMethod) {
      return false;
    }

    // Method-specific validation
    if (formData.paymentMethod === "card") {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.expiryDate ||
        !formData.cvv
      ) {
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a mock transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Prepare the payment data
      const paymentData = {
        ...formData,
        transactionId,
        paymentDate: new Date().toISOString(),
      };

      // If onSubmitPayment is provided, call it
      if (typeof onSubmitPayment === "function") {
        await onSubmitPayment(paymentData);
      }

      // For demonstration, simulate success with smooth transition
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPaymentComplete(true);

        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/paymentconfirmation";
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsSubmitting(false);
      setErrors({ form: "Payment processing failed. Please try again." });
    }
  };

  // Custom styles for the green and white theme
  const styles = {
    container: {
      marginTop: "30px",
      marginBottom: "30px",
    },
    header: {
      color: "#2e7d32",
      marginBottom: "30px",
    },
    card: {
      border: "1px solid #2e7d32",
      borderRadius: "10px",
      marginBottom: "20px",
    },
    cardHeader: {
      backgroundColor: "#2e7d32",
      color: "white",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      padding: "15px",
    },
    cardBody: {
      padding: "20px",
    },
    methodCard: {
      cursor: "pointer",
      transition: "all 0.3s ease",
      height: "100%",
    },
    methodCardSelected: {
      borderColor: "#2e7d32",
      boxShadow: "0 0 0 3px rgba(46, 125, 50, 0.3)",
    },
    methodIcon: {
      fontSize: "2rem",
      color: "#2e7d32",
      marginBottom: "10px",
    },
    submitButton: {
      backgroundColor: "#2e7d32",
      border: "none",
      padding: "10px 20px",
      transition: "transform 0.3s ease",
    },
    submitButtonHover: {
      transform: "scale(1.2)",
    },
    successMessage: {
      textAlign: "center",
      padding: "50px 0",
      opacity: 1,
      transition: "opacity 0.5s ease-in-out",
    },
    successIcon: {
      fontSize: "4rem",
      color: "#2e7d32",
      marginBottom: "20px",
    },
    qrPlaceholder: {
      height: "300px",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
    },
    inputError: {
      borderColor: "#dc3545",
    },
    errorText: {
      color: "#dc3545",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    productContainer: {
      display: "flex",
      alignItems: "center",
      padding: "15px",
    },
    productImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    productDetails: {
      marginLeft: "20px",
      flex: 1,
    },
    productName: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    productPrice: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2e7d32",
      marginRight: "10px",
    },
    productOriginalPrice: {
      textDecoration: "line-through",
      color: "#777",
      fontSize: "1rem",
    },
    discountBadge: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      padding: "3px 8px",
      borderRadius: "4px",
      fontSize: "0.875rem",
      display: "inline-block",
      marginRight: "10px",
    },
    savingsText: {
      fontSize: "0.875rem",
      color: "#555",
    },
    productDescription: {
      fontSize: "0.875rem",
      color: "#555",
      marginTop: "8px",
    },
  };

  // Add hover effect to buttons
  const addHoverEffect = (e) => {
    e.currentTarget.style.transform = "scale(1.2)";
  };

  const removeHoverEffect = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  // Success message screen with smooth transition
  if (isPaymentComplete) {
    return (
      <Container style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <div style={styles.successMessage}>
              <BsCheckCircle style={styles.successIcon} />
              <h2 style={styles.header}>Payment Successful!</h2>
              <p>
                Thank you for your order. Your transaction ID is:{" "}
                <strong>{formData.transactionId || "TXN-123456789"}</strong>
              </p>
              <p>Your organic goods are on the way.</p>
              <p
                style={{
                  color: "#777",
                  fontSize: "0.875rem",
                  marginTop: "20px",
                }}
              >
                Redirecting you...
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <h2 style={styles.header}>Secure Checkout</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            {/* Product Information */}
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 className="mb-0">Product Information</h4>
              </div>
              <Card.Body style={styles.cardBody}>
                <div style={styles.productContainer}>
                  <img
                    src={formData.product.image || "/placeholder.svg"}
                    alt={formData.product.name}
                    style={styles.productImage}
                  />
                  <div style={styles.productDetails}>
                    <h3 style={styles.productName}>{formData.product.name}</h3>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={styles.productPrice}>
                        ₹{formData.product.price.toFixed(2)}
                      </span>
                      <span style={styles.productOriginalPrice}>
                        ₹{formData.product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={styles.discountBadge}>
                        {formData.product.discount}% OFF
                      </span>
                      <span style={styles.savingsText}>
                        You save: ₹
                        {(
                          formData.product.originalPrice -
                          formData.product.price
                        ).toFixed(2)}
                      </span>
                    </div>
                    <p style={styles.productDescription}>
                      Farm fresh organic produce bundle with seasonal vegetables
                      and fruits. Sourced directly from local farmers.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 className="mb-0">Payment Method</h4>
              </div>
              <Card.Body style={styles.cardBody}>
                <Row>
                  {/* UPI Payment Option */}
                  <Col md={4} className="mb-4">
                    <Card
                      style={{
                        ...styles.methodCard,
                        ...(formData.paymentMethod === "upi"
                          ? styles.methodCardSelected
                          : {}),
                      }}
                      onClick={() => handlePaymentMethodChange("upi")}
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      <Card.Body className="text-center">
                        <BsQrCode style={styles.methodIcon} />
                        <h5>UPI Payment</h5>
                        <p className="text-muted small">
                          Pay using any UPI app
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Cash on Delivery Option */}
                  <Col md={4} className="mb-4">
                    <Card
                      style={{
                        ...styles.methodCard,
                        ...(formData.paymentMethod === "cod"
                          ? styles.methodCardSelected
                          : {}),
                      }}
                      onClick={() => handlePaymentMethodChange("cod")}
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      <Card.Body className="text-center">
                        <BsCash style={styles.methodIcon} />
                        <h5>Cash on Delivery</h5>
                        <p className="text-muted small">Pay when you receive</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Card Payment Option */}
                  <Col md={4} className="mb-4">
                    <Card
                      style={{
                        ...styles.methodCard,
                        ...(formData.paymentMethod === "card"
                          ? styles.methodCardSelected
                          : {}),
                      }}
                      onClick={() => handlePaymentMethodChange("card")}
                      onMouseEnter={addHoverEffect}
                      onMouseLeave={removeHoverEffect}
                    >
                      <Card.Body className="text-center">
                        <BsCreditCard2Front style={styles.methodIcon} />
                        <h5>Credit/Debit Card</h5>
                        <p className="text-muted small">Secure card payment</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Payment method specific forms */}
                {formData.paymentMethod === "upi" && (
                  <div className="mt-4">
                    <h5>Scan to Pay</h5>
                    <p>
                      Scan the QR code below using any UPI app to make payment.
                    </p>
                    <div style={styles.qrPlaceholder} className="text-center">
                      <div>
                        <img
                          src="Upi.jpg"
                          alt="UPI QR Code"
                          style={{ height: "18rem", color: "#2e7d32" }}
                        />
                      </div>
                    </div>
                    <Row className="mt-3">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>UPI Reference ID (Optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="upiReference"
                            value={formData.upiReference}
                            onChange={handleInputChange}
                            placeholder="Enter reference ID after payment"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <p className="text-muted small">
                        <BsInfoCircle className="me-1" />
                        Your payment will be confirmed automatically
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="mt-4">
                    <h5>Cash on Delivery</h5>
                    <p>
                      Please provide any specific delivery instructions
                      (optional):
                    </p>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="deliveryInstructions"
                        placeholder="E.g., Leave at the doorstep, call before delivery, etc."
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <div className="text-center">
                      <p className="text-muted small">
                        <BsInfoCircle className="me-1" />
                        Please keep exact change ready for a smooth delivery
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "card" && (
                  <div className="mt-4">
                    <h5>Card Details</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <BsCreditCard2Front />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength="19"
                          isInvalid={!!errors.cardNumber}
                        />
                      </InputGroup>
                      {errors.cardNumber && (
                        <div style={styles.errorText}>{errors.cardNumber}</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cardName}
                      />
                      {errors.cardName && (
                        <div style={styles.errorText}>{errors.cardName}</div>
                      )}
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            maxLength="5"
                            isInvalid={!!errors.expiryDate}
                          />
                          {errors.expiryDate && (
                            <div style={styles.errorText}>
                              {errors.expiryDate}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="password"
                              placeholder="123"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              maxLength="4"
                              isInvalid={!!errors.cvv}
                            />
                            <InputGroup.Text>
                              <BsCreditCard2Back />
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.cvv && (
                            <div style={styles.errorText}>{errors.cvv}</div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-center">
                      <p className="text-muted small">
                        <BsInfoCircle className="me-1" />
                        Your card details are secure and encrypted
                      </p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 className="mb-0">Order Summary</h4>
              </div>
              <Card.Body style={styles.cardBody}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>₹{formData.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>₹{formData.tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong>₹{formData.total.toFixed(2)}</strong>
                </div>

                <p className="text-muted small mb-3">
                  Order ID: {formData.orderId}
                </p>

                {errors.form && (
                  <div className="alert alert-danger" role="alert">
                    {errors.form}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-100"
                  style={styles.submitButton}
                  disabled={!isFormValid() || isSubmitting}
                  onMouseEnter={addHoverEffect}
                  onMouseLeave={removeHoverEffect}
                >
                  {isSubmitting ? "Processing..." : "Complete Payment"}
                </Button>

                <div className="text-center mt-3">
                  <p className="text-muted small mb-0">
                    <BsInfoCircle className="me-1" />
                    Your order will be processed securely
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default PaymentGateway;

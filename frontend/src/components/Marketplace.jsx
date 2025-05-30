import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

import ProductCard from "./ProductCard";

// Extract unique categories & suppliers
const getUniqueValues = (products, key) => [
  ...new Set(products.map((product) => product[key])),
];

const Marketplace = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = getUniqueValues(products, "category");
  const suppliers = getUniqueValues(products, "supplier");

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const matchSupplier =
      selectedSuppliers.length === 0 ||
      selectedSuppliers.includes(product.supplier);

    return matchSearch && matchPrice && matchCategory && matchSupplier;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  useEffect(() => {
    // Check if user is logged in (Modify based on your authentication logic)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const quantityInput = document.getElementById(`quantity-${productId}`);
    if (!quantityInput) {
      console.error(`❌ Quantity input not found for product: ${productId}`);
      return;
    }

    const quantity = parseInt(quantityInput.value, 10);
    if (isNaN(quantity) || quantity <= 0) {
      console.error("❌ Invalid quantity");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/consumer/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      console.log(data.message);

      setAddedToCart((prev) => ({ ...prev, [productId]: true }));

      setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/products") // Adjust URL based on your backend
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Toggle filter sidebar
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <Container
      fluid
      className=" min-vh-100"
      style={{
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Hero Section */}
      <div
        className="bg-success text-white py-5 text-center mt-5"
        style={{
          backgroundImage: "url('/vegitable-market.jpg')",
          // height: "81vh",
          width: "97vw",
          // backgroundColor: "rgba(0, 0, 0, 0.60)",
        }}
      >
        <h1 className="fw-bold">Marketplace</h1>
        <p className="lead">Fresh from Farm to Your Table</p>
        <InputGroup className="w-50 mx-auto mt-3">
          <Form.Control
            type="text"
            placeholder="Search for vegetables, fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="dark">
            <Search />
          </Button>
        </InputGroup>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row>
          {/* Filters Sidebar */}
          <Col
            md={3}
            className={`bg-white p-4 rounded shadow ${
              isFilterOpen ? "d-block" : "d-none d-md-block"
            }`}
          >
            <div className="d-flex justify-content-between">
              <h4 className="mb-3">Filters</h4>
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-md-none"
                onClick={toggleFilter}
              >
                <ChevronLeft />
              </Button>
            </div>

            {/* Price Range */}
            <Form.Group className="mb-4">
              <Form.Label>Price Range (₹)</Form.Label>
              <Form.Range
                min="0"
                max="200"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
              />
              <Form.Range
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
              />
              <div className="d-flex justify-content-between">
                <small>Min: ₹{priceRange[0]}</small>
                <small>Max: ₹{priceRange[1]}</small>
              </div>
            </Form.Group>

            {/* Category Filters */}
            <Form.Group className="mb-4">
              <Form.Label>Categories</Form.Label>
              {categories.map((category) => (
                <Form.Check
                  key={category}
                  type="checkbox"
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    )
                  }
                />
              ))}
            </Form.Group>

            {/* Supplier Filters */}
            <Form.Group>
              <Form.Label>Suppliers</Form.Label>
              {suppliers.map((supplier) => (
                <Form.Check
                  key={supplier}
                  type="checkbox"
                  label={supplier}
                  checked={selectedSuppliers.includes(supplier)}
                  onChange={() =>
                    setSelectedSuppliers((prev) =>
                      prev.includes(supplier)
                        ? prev.filter((s) => s !== supplier)
                        : [...prev, supplier]
                    )
                  }
                />
              ))}
            </Form.Group>
          </Col>

          {/* Products List */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>{sortedProducts.length} Products Found</h4>
              <Form.Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </Form.Select>
            </div>

            <Row>
              {sortedProducts.map((product) => (
                <Col md={4} key={product._id} className="mb-4">
                  <Card className="shadow h-100 product-card">
                    <Card.Img variant="top" src={product.imageUrl} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>₹{product.price} / Kg</Card.Text>
                      <Card.Text className="text-muted">
                        {product.farmer.name}
                      </Card.Text>

                      {/* Quantity Input Field */}
                      <InputGroup className="mb-2">
                        <Form.Control
                          id={`quantity-${product._id}`}
                          type="number"
                          min="1"
                          defaultValue="1"
                        />
                      </InputGroup>

                      <Button
                        onClick={() => addToCart(product._id)}
                        variant="success"
                        className="w-100"
                      >
                        {addedToCart[product._id] ? "✔ Added" : "Add to Cart"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <style>
        {` 
        .product-card {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .product-card:hover {
        transform: scale(1.05);
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
        }
        `}
      </style>
    </Container>
  );
};

export default Marketplace;

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Brand Description */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>HarvestTrace</h5>
            <p>
              Building a transparent ecosystem for natural farming products, connecting farmers and conscious consumers for a sustainable future.
            </p>
          </div>

          {/* Farmers Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>For Farmers</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white footer-link">Get Certified</a></li>
              <li><a href="#" className="text-white footer-link">Farming Standards</a></li>
              <li><a href="#" className="text-white footer-link">Success Stories</a></li>
              <li><a href="#" className="text-white footer-link">Farmer Resources</a></li>
            </ul>
          </div>

          {/* Consumers Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>For Consumers</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white footer-link">How to Verify</a></li>
              <li><a href="#" className="text-white footer-link">Product Categories</a></li>
              <li><a href="#" className="text-white footer-link">Seasonal Guide</a></li>
              <li><a href="#" className="text-white footer-link">Delivery Information</a></li>
              <li><a href="#" className="text-white footer-link">Customer Reviews</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white footer-link">About Us</a></li>
              <li><a href="#" className="text-white footer-link">Our Mission</a></li>
              <li><a href="#" className="text-white footer-link">Certification Process</a></li>
              <li><a href="#" className="text-white footer-link">Careers</a></li>
              <li><a href="#" className="text-white footer-link">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; 2025 HarvestTrace. All rights reserved. | 
            <a href="#" className="text-white footer-link"> Privacy Policy </a> | 
            <a href="#" className="text-white footer-link"> Terms of Service</a>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .footer-link {
            text-decoration: none;
            transition: color 0.3s ease-in-out;
          }

          .footer-link:hover {
            color: #01c64b !important;
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .text-center {
              text-align: center !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;

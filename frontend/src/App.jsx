import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import ThreeJSBackground from "./components/ThreeJSBackground";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTAsection";
import AuthForm from "./components/AuthForm";
import Login from "./components/Login";
import Marketplace from "./components/Marketplace";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/AdminDashboard";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductCard from "./components/ProductCard";
import "./app.css";
import PaymentConfirmation from "./components/PaymentConfirmation";
import PaymentGateway from "./components/PaymentGateway";

// Home Page Layout
const HomePage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} // Starts invisible, moves up
    animate={{ opacity: 1, y: 0 }} // Fades in & moves into position
    exit={{ opacity: 0, y: -20 }} // Moves up & disappears
    transition={{ duration: 0.3 }} // Animation duration
  >
    <Hero />
    <FeatureCards />
    <Testimonials />
    <CTASection />
  </motion.div>
);

// Layout Component (Footer only on Home & Marketplace)
const Layout = ({ children }) => {
  const location = useLocation();
  const showFooter =
    location.pathname === "/" || location.pathname === "/marketplace";

  return (
    <>
      <ThreeJSBackground />
      <Header />
      {children}
      {showFooter && <Footer />}
    </>
  );
};

const App = () => {
  const location = useLocation(); // Required for animations

  return (
    <Layout>
      <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
        {/* ✅ Wrap Routes with AnimatePresence for Smooth Transitions */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/register"
              element={
                <AnimatedPage>
                  <AuthForm />
                </AnimatedPage>
              }
            />
            <Route
              path="/checkout"
              element={
                //map wala page
                <AnimatedPage>
                  <PaymentConfirmation />
                </AnimatedPage>
              }
              />
              <Route
              path="/payment"
              element={
                <AnimatedPage>
                  <PaymentGateway />
                </AnimatedPage>
              }
            />
            <Route
              path="/paymentconfirmation"
              element={
                <AnimatedPage>
                  <PaymentConfirmation />
                </AnimatedPage>
              }
            />
            <Route
              path="/login"
              element={
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              }
            />
            <Route
              path="/ObviouslyNotAdmin/login"
              element={
                <AnimatedPage>
                  <AdminLogin />
                </AnimatedPage>
              }
            />
            <Route
              path="/marketplace"
              element={
                <AnimatedPage>
                  <Marketplace />
                </AnimatedPage>
              }
            />
            <Route
              path="/cart"
              element={
                <AnimatedPage>
                  <Cart />
                </AnimatedPage>
              }
            />
            <Route
              path="/AdminDashboard"
              element={
                <AnimatedPage>
                  <AdminDashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/farmerdashboard"
              element={
                <AnimatedPage>
                  <FarmerDashboard />
                </AnimatedPage>
              }
            />
            <Route
              path="/marketplace"
              element={
                <AnimatedPage>
                  <ProductCard product={{ id: 1 }} />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};

// ✅ Reusable Page Transition Component
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} // Fade in & slight zoom
      animate={{ opacity: 1, scale: 1 }} // Full visibility
      exit={{ opacity: 0, scale: 0.5 }} // Fade out effect
      transition={{ duration: 0.5 }} // Animation duration
    >
      {children}
    </motion.div>
  );
};

export default App;

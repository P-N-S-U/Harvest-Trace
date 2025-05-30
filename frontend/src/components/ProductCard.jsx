import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "react-bootstrap";
import { X } from "lucide-react";

function ProductCard({ product }) {
  const [showQR, setShowQR] = useState(false);
  const qrData = `http://localhost:5173/product/${product.id}`;

  return (
    <>
      {/* Show QR Button */}
      <Button
        variant="outline-success"
        className="w-100 mb-2"
        onClick={() => setShowQR(true)}
      >
        Show QR Code
      </Button>

      {/* QR Code Overlay */}
      {showQR && (
        <div className="qr-overlay">
          <button className="close-btn" onClick={() => setShowQR(false)}>
            <X size={28} />
          </button>
          <div className="qr-container flip-in">
            <QRCode value={qrData} size={200} />
          </div>
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          .qr-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
          }
          .qr-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: flipIn 0.6s ease-in-out;
          }
          .close-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.8);
            border: none;
            cursor: pointer;
            color: black;
            padding: 10px;
            border-radius: 50%;
            transition: background 0.3s;
          }
          .close-btn:hover {
            background: rgba(255, 255, 255, 1);
          }
          @keyframes flipIn {
            from { transform: rotateY(90deg); opacity: 0; }
            to { transform: rotateY(0deg); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

export default ProductCard;

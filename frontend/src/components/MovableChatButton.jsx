import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MovableChatButton = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const savedPosition = JSON.parse(
      localStorage.getItem("chatButtonPosition")
    );
    return savedPosition || { x: 20, y: window.innerHeight - 100 };
  });
  const [showChat, setShowChat] = useState(false);
  const buttonRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  useEffect(() => {
    localStorage.setItem("chatButtonPosition", JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(
        0,
        Math.min(window.innerWidth - 60, dragRef.current.startPosX + deltaX)
      ),
      y: Math.max(
        0,
        Math.min(window.innerHeight - 60, dragRef.current.startPosY + deltaY)
      ),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleChat = () => {
    if (!isDragging) {
      setShowChat(!showChat);
    }
  };

  return (
    <div
      className="position-fixed"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        transition: isDragging ? "none" : "all 0.3s ease",
      }}
    >
      {/* Chat Button */}
      <button
        ref={buttonRef}
        className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-lg"
        style={{
          width: "56px",
          height: "56px",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onClick={toggleChat}
        aria-label="Chat with FarmBuddy"
      >
        {/* Using Flaticon chatbot icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/128/4712/4712039.png"
          alt="Chatbot Icon"
          style={{ width: "30px", height: "30px" }}
        />
      </button>

      {/* Chat Window */}
      {showChat && (
        <div
          className="position-absolute shadow border bg-white "
          style={{
            bottom: "120px",
            right: "0",
            width: "19rem",
            height: "23rem",
          }}
        >
          <div className="d-flex justify-content-between align-items-center bg-success text-white p-2 rounded-top">
            <span className="fw-bold">FarmBuddy</span>
            <button
              onClick={() => setShowChat(false)}
              className="btn btn-sm btn-light"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>
          <iframe
            className="rounded-bottom"
            style={{ width: "100%", height: "100%" }}
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/20/09/20250320094224-I1LNTMN3.json"
            title="FarmBuddy"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MovableChatButton;

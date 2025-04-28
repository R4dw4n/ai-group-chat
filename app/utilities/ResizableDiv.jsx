"use client"
import React, { useState, useRef } from "react";

const ResizableDiv = ({ initialWidth, className, children }) => {
  const [width, setWidth] = useState(initialWidth); // Initial width
  const isResizing = useRef(false); // Track if resizing is active

  const handleMouseDown = (e) => {
    e.preventDefault();
    isResizing.current = true; // Start resizing
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX; // Calculate new width based on mouse position
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false; // Stop resizing
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`relative border border-gray ${className}`}
      style={{ width: `${width}px`, minWidth: "91px" }}
    >
      {/* Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-dark-gray"
        onMouseDown={handleMouseDown}
      ></div>

      {/* Content */}
      {children}
    </div>
  );
};

export default ResizableDiv;

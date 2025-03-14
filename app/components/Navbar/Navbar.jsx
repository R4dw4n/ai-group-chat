import React from "react";

function Navbar({ children }) {
  return (
    <div className="h-20 flex justify-between items-center sticky top-0 z-20 bg-background">
      {children}
    </div>
  );
}

export default Navbar;

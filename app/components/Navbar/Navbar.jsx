import React from "react";

function Navbar({ children }) {
  return (
    <div className="h-20 w-screen flex justify-between items-center">
      {children}
    </div>
  );
}

export default Navbar;

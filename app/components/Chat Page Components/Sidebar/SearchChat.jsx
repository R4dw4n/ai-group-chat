import React from "react";

function SearchChat({ className }) {
  return (
    <input
      placeholder="Search"
      className={`placeholder-light-gray/30 w-full px-4 py-2 outline-none rounded-4xl bg-[#404045] text-light-gray ${className}`}
    />
  );
}

export default SearchChat;

import React from "react";

const stylesScreen = {
  true: "fixed w-screen h-screen flex flex-col justify-center items-center inset-0 bg-[#00000073] z-[99999]",
  false: "",
};
const stylesLoading = {
  true: "opacity-100",
  false: "opacity-0",
};
const stylesSize = {
  sm: "w-8 h-8",
  lg: "w-12 h-12",
}
function Loading({ isLoading = true, fullscreen = false, size="lg" }) {
  return (
    isLoading && (
      <div
        className={`${stylesScreen[`${fullscreen}`]} ${
          stylesLoading[`${isLoading}`]
        }`}
      >
        <span className={`${stylesSize[size]} border-4 border-white border-b-transparent rounded-full inline-block box-border animate-spin`}></span>
      </div>
    )
  );
}

export default Loading;

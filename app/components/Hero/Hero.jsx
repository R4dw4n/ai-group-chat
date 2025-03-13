import React from "react";

function Hero() {
  return (
    <div className="w-5xl h-[635px] py-32 m-auto text-center">
      <h1 className="text-[52px] text-white whitespace-nowrap">
        Supercharge your conversations with
      </h1>
      <h1 className="text-[52px] text-primary-blue whitespace-nowrap -mt-5">
        AI-Powered Group Chat
      </h1>

      <p className="text-2xl text-white m-10 leading-12">
        Elevate your group chats with AI! Enhance interactions, stimulate
        creativity, and enjoy an engaging chatting experience. Supercharge your
        conversations today!
      </p>

      <button className="group relative text-light-gray w-xl h-14 rounded-[20px] cursor-pointer overflow-hidden">
        {/* <!-- Background Gradient --> */}
        <div className="w-full absolute inset-0 bg-gradient-to-r from-primary-blue to-secondary-purple transition-opacity duration-500 group-hover:opacity-0"></div>

        {/* <!-- Hover Gradient --> */}
        <div className="w-full absolute inset-0 bg-gradient-to-l from-primary-blue to-secondary-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

        {/* <!-- Button Text --> */}
        <span className="relative z-10">Get Started Now</span>
      </button>
    </div>
  );
}

export default Hero;

"use client";
import useTypewriter from "@/app/hooks/useTypewriter";
import { useInView, motion } from "motion/react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  const {
    currentText: header1,
    showCursor: showCursor1,
    restart: restart1,
  } = useTypewriter(t("heroheader1"), 1200);
  const {
    currentText: header2,
    showCursor: showCursor2,
    restart: restart2,
  } = useTypewriter(t("heroheader2"), 1200, 1210);
  const {
    currentText: prargraph,
    showCursor: showCursor3,
    restart: restart3,
  } = useTypewriter(t("heroparagraph"), 2500, 2420);

  const ref = useRef();
  const isInView = useInView(ref);
  useEffect(() => {
    if (isInView) {
      restart1();
      restart2();
      restart3();
    }
  }, [isInView]);

  return (
    <div
      className="w-5xl h-[calc(100vh-80px)] py-32 m-auto text-center"
      id="Home"
    >
      <h1 ref={ref} className="text-[52px] text-white whitespace-nowrap">
        {header1}
        <span
          className={`inline-block w-4 bg-white h-10 transition-opacity duration-100 ${
            showCursor1 ? "opacity-100" : "opacity-0"
          }`}
        ></span>
      </h1>
      <h1 className="text-[52px] text-primary-blue whitespace-nowrap -mt-5">
        {header2}
        <span
          className={`inline-block w-4 bg-white h-10 transition-opacity duration-100 ${
            showCursor2 ? "opacity-100" : "opacity-0"
          }`}
        ></span>
      </h1>

      <p className="text-2xl text-white m-10 leading-12">
        {prargraph}
        <span
          className={`inline-block w-2 bg-white h-5 transition-opacity duration-100 ${
            showCursor3 ? "opacity-100" : "opacity-0"
          }`}
        ></span>
      </p>

      <button className="group relative text-light-gray w-xl h-14 rounded-[20px] cursor-pointer overflow-hidden">
        {/* <!-- Background Gradient --> */}
        <div className="w-full absolute inset-0 bg-gradient-to-r from-primary-blue to-secondary-purple transition-opacity duration-500 group-hover:opacity-0"></div>

        {/* <!-- Hover Gradient --> */}
        <div className="w-full absolute inset-0 bg-gradient-to-l from-primary-blue to-secondary-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

        {/* <!-- Button Text --> */}
        <span className="relative z-10">{t("get_started")}</span>
      </button>
    </div>
  );
}

export default Hero;

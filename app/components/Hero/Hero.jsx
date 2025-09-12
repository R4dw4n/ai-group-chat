"use client";

import { useInView, motion } from "motion/react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../PrimaryButton";
import useTypewriter from "../../hooks/useTypewriter";
import Link from "next/link";

function Hero() {
  const { t, i18n } = useTranslation();
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
      <Link href={`/${i18n.language}/chats`}>
        <PrimaryButton width="w-xl" height="h-14">
          {t("get_started")}
        </PrimaryButton>
      </Link>
    </div>
  );
}

export default Hero;

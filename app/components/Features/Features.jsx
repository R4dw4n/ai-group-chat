"use client";
import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "react-i18next";
import { featuresItems } from "./FeaturesItems";
import Card from "../Cards/Card";

const variants = {
  initial: {
    opacity: 0,
    x: "-200vw",
    transition: {
      duration: 0.1,
      delay: 0,
    },
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      opacity: {
        delay: 0.5,
        duration: 2,
      },
      x: {
        delay: 0,
        duration: 1,
      },
    },
  },
};

const h1Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

function Features() {
  const { t } = useTranslation();
  const ref = useRef();
  const isInView = useInView(ref);
  return (
    <div id="Features" className="w-5xl m-auto mt-2 overflow-x-hidden" ref={ref}>
      <motion.h1
        variants={h1Variants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="text-[52px] text-primary-blue text-center"
      >
        {t("features")}
      </motion.h1>

      <motion.div
        variants={variants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="p-1 grid grid-cols-2 grid-rows-2 w-full gap-4"
      >
        {featuresItems.map((item, ind) => (
          <Card
            item={item}
            key={ind}
            titleStyle="text-2xl text-light-gray"
            descriptionStyle="text-sm text-center text-light-gray/50 w-full"
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Features;

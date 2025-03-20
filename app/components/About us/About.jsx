"use client";
import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslation } from "react-i18next";
import Card from "../Cards/Card";
import { aboutItems } from "./AboutItems";

const variants = {
  initial: {
    opacity: 0,
    transition: {
      duration: 0.1,
      delay: 0,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 4,
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    transition: {
      duration: 0.1,
      delay: 0,
    },
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 2,
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

function About() {
  const { t } = useTranslation();
  const ref = useRef();
  const isInView = useInView(ref);
  return (
    <div id="About" className="w-5xl m-auto my-32" ref={ref}>
      <motion.h1
        variants={h1Variants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="text-[52px] text-primary-blue text-center"
      >
        {t("about_us")}
      </motion.h1>

      <motion.div
        variants={variants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="p-1 grid grid-cols-3 grid-rows-2 w-full gap-4"
      >
        {aboutItems.map((item, ind) => (
          <Card
            key={ind}
            motionVariants={itemVariants}
            item={item}
            titleStyle="text-3xl text-light-gray"
            descriptionStyle="text-center text-light-gray/50 w-full"
          />
        ))}
      </motion.div>
    </div>
  );
}

export default About;

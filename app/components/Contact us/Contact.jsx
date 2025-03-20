"use client";
import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import PhoneSVG from "./PhoneSVG";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../PrimaryButton";

const contactVariants = {
  initial: {
    y: 300,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const formVariants = {
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
      delay: 4,
      duration: 1.5,
      x: {
        duration: 0,
      },
    },
  },
};

const svgDivVariants = {
  initial: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0,
      x: 0,
    },
  },
  animate: {
    opacity: 0,
    x: "-200vw",
    transition: {
      delay: 3,
      duration: 1,
      x: {
        delay: 4.1,
        duration: 0,
      },
    },
  },
};

function Contact() {
  const ref = useRef();
  const inView = useInView(ref);
  const formRef = useRef();

  const { t } = useTranslation();

  return (
    <motion.div
      id="Contact"
      ref={ref}
      variants={contactVariants}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      className="w-screen p-4 md:py-24 md:max-w-[65%] m-auto flex flex-col md:flex-row items-center gap-5 md:gap-12"
    >
      <motion.div className="flex-[1] flex flex-col gap-5 md:gap-10 text-center md:text-left items-center md:items-stretch">
        <motion.h1 variants={contactVariants} className="text-4xl md:text-8xl text-white">
          {t("work_together")}
        </motion.h1>
        <motion.div variants={contactVariants}>
          <h2 className="text-xl md:text-3xl text-white">{t("email")}</h2>
          <span className="font-[300] text-white">radwan.basket@gmail.com</span>
        </motion.div>

        <motion.div variants={contactVariants}>
          <h2 className="text-xl md:text-3xl text-white">{t("address")}</h2>
          <span className="font-[300] text-white">{t("homs_syria")}</span>
        </motion.div>

        <motion.div variants={contactVariants}>
          <h2 className="text-xl md:text-3xl text-white">{t("phone_number")}</h2>
          <span className="font-[300] text-white">+963 954 013 609</span>
          <br />
          <span className="font-[300] text-white">+963 934 434 738</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-[2] md:flex-[1] overflow-x-hidden w-full md:w-auto"
        variants={contactVariants}
      >
        <motion.div
          className="absolute hidden md:block m-auto stroke-primary-blue"
          variants={svgDivVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <PhoneSVG inView={inView} width="450px" height="450px" />
        </motion.div>
        {/* MAKE THE SVG SMALLER ON MOBLIE SCREENS */}
        <motion.div
          className="absolute block md:hidden m-auto stroke-primary-blue"
          variants={svgDivVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <PhoneSVG inView={inView} width="300px" height="300px" />
        </motion.div>
        <motion.form
          ref={formRef}
          onSubmit={() => console.log("Submitted Successfully!")}
          className="flex flex-col gap-4"
          variants={formVariants}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <input
            name="from_name"
            className="p-3 md:p-6 bg-transparent outline-none border border-white text-white rounded placeholder-gray/75"
            type="text"
            placeholder={t("name")}
            required
          />
          <input
            name="email"
            className="p-3 md:p-6 bg-transparent outline-none border border-white text-white rounded placeholder-gray/75"
            type="email"
            placeholder={t("email")}
            required
          />
          <textarea
            name="message"
            className="p-3 md:p-6 bg-transparent outline-none border border-white text-white rounded placeholder-gray/75"
            rows={8}
            placeholder={t("message")}
            required
          />
          <PrimaryButton width="w-full">
            {t("submit")}
          </PrimaryButton>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default Contact;

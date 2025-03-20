"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export default function Card({
  item,
  titleStyle,
  descriptionStyle,
  motionVariants = null,
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={motionVariants}
      className="hover:scale-[1.03] transition-all duration-150 flex flex-col justify-center rounded-lg items-center gap-4 p-4 bg-gradient-to-r from-dark-gray to-cards/20"
    >
      <div className="flex flex-col justify-center items-center gap-1">
        <h2 className={titleStyle}>{t(`${item.title}`)}</h2>
        <div className="bg-primary-blue w-1/2 h-1 rounded-md"></div>
      </div>
      {item.icon && (
        <Image alt="card" src={item.icon} width={100} height={100} />
      )}
      <p className={descriptionStyle}>{t(`${item.description}`)}</p>
    </motion.div>
  );
}

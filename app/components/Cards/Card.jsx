"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Card({ item }) {
  const { t } = useTranslation();
  return (
    <div className="hover:scale-[1.03] transition-all duration-150 flex flex-col justify-center rounded-lg items-center gap-4 p-4 bg-gradient-to-r from-dark-gray to-cards/20">
      <div className="flex flex-col justify-center items-center gap-1">
        <h2 className="text-2xl text-light-gray">{t(`${item.title}`)}</h2>
        <div className="bg-primary-blue w-1/2 h-1 rounded-md"></div>
      </div>
      {item.icon && (
        <Image alt="card" src={item.icon} width={100} height={100} />
      )}
      <p className="text-sm text-center text-light-gray/50 w-full">{t(`${item.description}`)}</p>
    </div>
  );
}

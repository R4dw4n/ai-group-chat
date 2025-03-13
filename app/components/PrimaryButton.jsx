"use client";
import React from "react";
import { useTranslation } from "react-i18next";

function PrimaryButton({
  width="",
  height="",
  fromColor="",
  toColor="",
  hoverFromColor="",
  hoverToColor="",
}) {
  const { t } = useTranslation();
  return (
    <button
      className={`group relative text-light-gray w-48 h-14 rounded-[20px] cursor-pointer overflow-hidden ${width} ${height}`}
    >
      {/* <!-- Background Gradient --> */}
      <div
        className={`w-full absolute inset-0 bg-gradient-to-r from-primary-blue to-secondary-purple transition-opacity duration-500 group-hover:opacity-0 ${fromColor} ${toColor}`}
      ></div>

      {/* <!-- Hover Gradient --> */}
      <div
        className={`"w-full absolute inset-0 bg-gradient-to-l from-primary-blue to-secondary-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverFromColor} ${hoverToColor}`}
      ></div>

      {/* <!-- Button Text --> */}
      <span className="relative z-10">{t("login")}</span>
    </button>
  );
}

export default PrimaryButton;

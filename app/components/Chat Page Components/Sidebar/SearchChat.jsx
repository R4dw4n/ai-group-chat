"use client"
import React from "react";
import { useTranslation } from "react-i18next";

function SearchChat({ className }) {
  const { t } = useTranslation();
  return (
    <input
      placeholder={t("search")}
      className={`placeholder-light-gray/30 w-full px-4 py-2 outline-none rounded-4xl bg-[#404045] text-light-gray ${className}`}
    />
  );
}

export default SearchChat;

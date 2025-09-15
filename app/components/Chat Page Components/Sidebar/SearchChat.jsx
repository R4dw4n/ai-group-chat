"use client"
import React from "react";
import { useTranslation } from "react-i18next";

function SearchChat({ className, setFilteredGroups, groups }) {
  const { t } = useTranslation();
  const handleSearch = (e) => {
    const value = e.target.value;
    if (!value) {
      setFilteredGroups(groups);
    };
    setFilteredGroups((prev) => prev.filter((group) => group.name.toLowerCase().includes(value.toLowerCase())));
  };
  return (
    <input
      placeholder={t("search")}
      className={`placeholder-light-gray/30 w-full px-4 py-2 outline-none rounded-4xl bg-[#404045] text-light-gray ${className}`}
      onChange={handleSearch}
    />
  );
}

export default SearchChat;

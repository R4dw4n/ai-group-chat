"use client"
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const borderStyle = {
  en: "border-l border-l-navigation-gray/75",
  ar: "border-r border-r-navigation-gray/75"
}

function Footer() {
  const { t, i18n } = useTranslation();
  return (
    <div className="h-20 flex justify-between items-center bg-dark-gray px-5">
      <div className="text-navigation-gray">
        {t("copyright")}
      </div>
      <div className={`${borderStyle[i18n.language]} flex gap-4 px-2`}>
        <Link href="/privacypolicy" className="hover:text-white text-navigation-gray">
          {t("prviacypolicy")}
        </Link>
        <Link href="/terms" className="hover:text-white text-navigation-gray">
          {t("terms")}
        </Link>
      </div>
    </div>
  );
}

export default Footer;

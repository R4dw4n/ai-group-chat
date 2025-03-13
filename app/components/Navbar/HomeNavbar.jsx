"use client"
import Image from "next/image";
import React from "react";
import NavbarList from "./NavbarList";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { images } from "@/app/utilities/assets";
import { useTranslation } from "react-i18next";

function HomeNavbar() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center">
        <Image priority src={images.LOGO} alt="Logo" width={100} height={100} />
        <NavbarList />
      </div>
      <div className="flex items-center justify-center pr-4 pt-4 gap-4">
        <LanguageSwitcher />
        <button className="group relative text-light-gray w-48 h-14 rounded-[20px] cursor-pointer overflow-hidden">
          {/* <!-- Background Gradient --> */}
          <div className="w-full absolute inset-0 bg-gradient-to-r from-primary-blue to-secondary-purple transition-opacity duration-500 group-hover:opacity-0"></div>

          {/* <!-- Hover Gradient --> */}
          <div className="w-full absolute inset-0 bg-gradient-to-l from-primary-blue to-secondary-purple opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

          {/* <!-- Button Text --> */}
          <span className="relative z-10">{t('login')}</span>
        </button>
      </div>
    </>
  );
}

export default HomeNavbar;

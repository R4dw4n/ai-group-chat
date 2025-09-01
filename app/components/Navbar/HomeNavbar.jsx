"use client"
import Image from "next/image";
import React from "react";
import NavbarList from "./NavbarList";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { images } from "../../../app/utilities/assets";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../PrimaryButton";
import Link from "next/link";

const paddingStyle = {
  ar: "pl-4",
  en: "pr-4"
}

function HomeNavbar() {
  const { i18n, t } = useTranslation();
  return (
    <>
      <div className="flex items-center">
        <Image priority src={images.LOGO} alt="Logo" width={100} height={100} />
        <NavbarList />
      </div>
      <div className={`flex items-center justify-center ${paddingStyle[i18n.language]} pt-4 gap-4`}>
        <LanguageSwitcher />
        <Link href={`/${i18n.language}/login`}>
          <PrimaryButton>
            {t("login")}
          </PrimaryButton>
        </Link>
      </div>
    </>
  );
}

export default HomeNavbar;

'use client'
import LanguageSwitcher from "@/app/components/LanguageSwitcher/LanguageSwitcher";
import Navbar from "@/app/components/Navbar/Navbar";
import { images } from "@/app/utilities/assets";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const paddingStyle = {
  ar: "pl-4",
  en: "pr-4"
}
export default function RootLayout({ children }) {
  const [t, i18n] = useTranslation();
  return (
    <>
      <Navbar>
        <div className="flex items-center">
          <Image
            priority
            src={images.LOGO}
            alt="Logo"
            width={100}
            height={100}
          />
        </div>
        <div
          className={`flex items-center justify-center ${
            paddingStyle[i18n.language]
          } pt-4 gap-4`}
        >
          <LanguageSwitcher />
        </div>
      </Navbar>
      {children}
    </>
  );
}

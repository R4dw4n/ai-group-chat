"use client";
import { icons } from "@/app/utilities/assets";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const positionLanguages = {
  ar: "-right-[70px]",
  en: "-left-[70px]",
};

function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    {
      label: "English",
      code: "en",
    },
    {
      label: "عربي",
      code: "ar",
    },
  ];
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image src={icons.LANGUAGE} alt="language" width={25} height={25} />
      </button>
      <div
        dir="rtl"
        className={`absolute mt-2 transition-all duration-150 ${
          isOpen ? "h-20" : "h-0"
        } bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
          positionLanguages[i18n.language]
        } top-[25px]`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setIsOpen(false);
              const segments = pathname.split("/");
              segments[1] = lang.code;
              router.push(segments.join("/"))
            }}
            className="w-full p-2 text-left text-light-gray hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;

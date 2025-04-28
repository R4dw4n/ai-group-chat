"use client";
import { setTokens } from "@/app/api/axiosInstance";
import { authService } from "@/app/api/services/authService";
import PrimaryButton from "@/app/components/PrimaryButton";
import { icons } from "@/app/utilities/assets";
import Loading from "@/app/utilities/Loading";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const eyePosition = {
  en: "right-0 top-1/3",
  ar: "left-0 top-1/3",
};

const fieldIconPosition = {
  en: "left-0 top-1/3",
  ar: "right-0 top-1/3",
};

function Page() {
  const [t, i18n] = useTranslation();
  const router = useRouter();
  const [model, setModel] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "",
    accept: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "",
    accept: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");

  const getEye = (showPassword) => {
    return showPassword === "password" ? icons.HIDE : icons.EYE;
  };

  const fieldValueChanged = (value, fieldName) => {
    setModel((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
    setFieldErrors((prev) => {
      if (fieldName === "password") {
        return {
          ...prev,
          [fieldName]: "",
          confirmPassword: "",
        };
      }
      return {
        ...prev,
        [fieldName]: "",
      };
    });
  };
  const handleSubmit = (e) => {
    if (e.preventDefault) e.preventDefault();
    if (
      !model.email ||
      !model.password ||
      !model.confirmPassword ||
      !model.username ||
      !model.fullName ||
      !model.accept || 
      model.password !== model.confirmPassword
    ) {
      setFieldErrors((prev) => {
        const ret = { ...prev };
        if (!model.email) ret.email = "Email is required.";
        if (!model.password) ret.password = "Password is required.";
        else if (model.password !== model.confirmPassword) ret.confirmPassword = "Passwords are not matching."
        if (!model.confirmPassword) ret.confirmPassword = "Confirming password is required.";
        if (!model.username) ret.username = "Username is required.";
        if (!model.fullName) ret.fullName = "Fullname is required.";
        if (!model.accept) ret.accept = true;

        return { ...ret };
      });
      return;
    }
    register();
  };
  const register = async () => {
    try {
      setLoading(true);
      const res = await authService.register(model);
      message.success(t("success"), 2);
      router.push("/login");
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(error.response.data.message, 2);
        error.response.data.errors.forEach((item) => {
          fieldErrors[item.field] = item.message;
        });
        setFieldErrors({ ...fieldErrors });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(loading);
  }, [loading]);
  return (
    <>
      <div className="min-h-[calc(100vh-80px)] min-w-screen pb-20 px-44 bg-background overflow-x-hidden">
        <form
          onSubmit={handleSubmit}
          className="w-xl py-12 px-8 bg-dark-gray flex flex-col justify-center items-center rounded-2xl mx-auto overflow-x-hidden"
        >
          {/* TITLES */}
          <h1 className="text-greeting-gray text-3xl font-lato mb-5">
            {t("registerGreeting")}
          </h1>
          <h1 className="text-primary-blue text-3xl font-lato  leading-3 tracking-widest mb-16">
            {t("registerTitle")}
          </h1>
          {/* ----FIELDS--- */}
          {/* FULLNAME  */}
          <div className="relative w-lg px-12">
            <Image
              alt="email"
              src={icons.USER}
              width={25}
              height={25}
              className={`absolute ${fieldIconPosition[i18n.language]}`}
            />
            <input
              placeholder={t("fullName")}
              className={`outline-none placeholder:font-semibold placeholder:text-lg text-greeting-gray text-lg w-md h-16 ${
                fieldErrors.email ? "border-b-3 border-error" : ""
              }`}
              name="fullName"
              type="text"
              onChange={(e) => fieldValueChanged(e.target.value, "fullName")}
            />
            <p className="text-error font-semibold">{fieldErrors.fullName}</p>
          </div>
          {/* USERNAME  */}
          <div className="relative w-lg px-12">
            <Image
              alt="email"
              src={icons.USER}
              width={25}
              height={25}
              className={`absolute ${fieldIconPosition[i18n.language]}`}
            />
            <input
              placeholder={t("username")}
              className={`outline-none placeholder:font-semibold placeholder:text-lg text-greeting-gray text-lg w-md h-16 ${
                fieldErrors.email ? "border-b-3 border-error" : ""
              }`}
              name="username"
              type="text"
              onChange={(e) => fieldValueChanged(e.target.value, "username")}
            />
            <p className="text-error font-semibold">{fieldErrors.username}</p>
          </div>
          {/* EMAIL  */}
          <div className="relative w-lg px-12">
            <Image
              alt="email"
              src={icons.EMAIL}
              width={25}
              height={25}
              className={`absolute ${fieldIconPosition[i18n.language]}`}
            />
            <input
              placeholder={t("email_address")}
              className={`outline-none placeholder:font-semibold placeholder:text-lg text-greeting-gray text-lg w-md h-16 ${
                fieldErrors.email ? "border-b-3 border-error" : ""
              }`}
              name="email"
              type="email"
              onChange={(e) => fieldValueChanged(e.target.value, "email")}
            />
            <p className="text-error font-semibold">{fieldErrors.email}</p>
          </div>
          {/* PASSORD  */}
          <div className="relative w-lg px-12">
            <Image
              alt="lock"
              src={icons.LOCK}
              width={20}
              height={20}
              className={`absolute ${fieldIconPosition[i18n.language]}`}
            />
            <input
              placeholder={t("password")}
              className={`outline-none placeholder:font-semibold placeholder:text-lg text-lg text-greeting-gray w-md h-16 ${
                fieldErrors.password ? "border-b-3 border-error" : ""
              }`}
              name="password"
              type={showPassword}
              onChange={(e) => fieldValueChanged(e.target.value, "password")}
            />
            <p className="text-error font-semibold">{fieldErrors.password}</p>
            <Image
              alt="eye"
              src={getEye(showPassword)}
              width={25}
              height={25}
              onClick={() =>
                setShowPassword((prev) =>
                  prev === "text" ? "password" : "text"
                )
              }
              className={`absolute cursor-pointer ${
                eyePosition[i18n.language]
              }`}
            />
          </div>
          {/* CONFIRM PASSWORD */}
          <div className="relative w-lg px-12">
            <Image
              alt="lock"
              src={icons.LOCK}
              width={20}
              height={20}
              className={`absolute ${fieldIconPosition[i18n.language]}`}
            />
            <input
              placeholder={t("confirm_password")}
              className={`outline-none placeholder:font-semibold placeholder:text-lg text-lg text-greeting-gray w-md h-16 ${
                fieldErrors.confirmPassword ? "border-b-3 border-error" : ""
              }`}
              name="confirmPassword"
              type={showConfirmPassword}
              onChange={(e) =>
                fieldValueChanged(e.target.value, "confirmPassword")
              }
            />
            <p className="text-error font-semibold">
              {fieldErrors.confirmPassword}
            </p>
            <Image
              alt="eye"
              src={getEye(showConfirmPassword)}
              width={25}
              height={25}
              onClick={() =>
                setShowConfirmPassword((prev) =>
                  prev === "text" ? "password" : "text"
                )
              }
              className={`absolute cursor-pointer ${
                eyePosition[i18n.language]
              }`}
            />
          </div>
          {/* REMEMBER ME & FORGOT PASSWORD */}
          <div className="flex justify-between items-center w-full mt-3 mb-10">
            <div className="flex gap-2 items-center">
              <label className="relative inline-flex items-center">
                {/* <!-- Hidden default checkbox --> */}
                <input
                  type="checkbox"
                  className={`h-5 w-5 cursor-pointer rounded ${
                    fieldErrors.accept ? "border-2 border-error" : "border border-gray-800"
                  } bg-background
                  appearance-none 
                  checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIwIDZMOSAxN2wtNS01IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+')] 
                  checked:bg-center checked:bg-no-repeat`}
                  onClick={(e) => fieldValueChanged(e.target.checked, "accept")}
                />
              </label>
              <span className="text-greeting-gray font-semibold">
                {t("accept_terms")}
              </span>
            </div>
          </div>
          {/* SUBMIT BUTTON */}
          <PrimaryButton
            width="w-[512px]"
            height="h-[54px]"
            onClick={handleSubmit}
          >
            {t("signup")}
          </PrimaryButton>

          {/* ---OR--- */}
          <div className="flex mt-1 items-center">
            <div className="h-0.5 w-[230px] rounded-md bg-greeting-gray mb-6"></div>
            <span className="text-greeting-gray mb-[27px] ml-[5px] mr-[5px]">
              {t("or")}
            </span>
            <div className="h-0.5 w-[230px] rounded-md bg-greeting-gray mb-6"></div>
          </div>

          {/* SIGNIN HERE */}
          <div className="flex gap-1 items-center">
            <span className="text-greeting-gray text-lg tracking-wide">
              {t("have_account?")}
            </span>
            <Link
              href={"/login"}
              className="text-greeting-gray text-lg tracking-wider underline hover:text-light-gray transition-colors duration-200"
            >
              {t("login")}
            </Link>
          </div>
        </form>
      </div>
      <Loading isLoading={loading} fullscreen />
    </>
  );
}

export default Page;

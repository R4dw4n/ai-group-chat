"use client"
import { images } from "@/app/utilities/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

function ChatItem({ chat }) {
  const { t, i18n } = useTranslation();
  return (
    <Link
      href={`/${i18n.language}/chats?chatId=${chat.id}`}
      className="flex items-center justify-center px-4 py-2 w-full"
    >
      <div className="overflow-hidden flex rounded-full w-12 h-12">
        {chat?.avatarUrl && <Image alt="profile-pic" src={chat?.avatarUrl} />}
        {!chat?.avatarUrl && <Image alt="profile-pic" src={images.PROFILE} />}
      </div>
      <div className="p-2 hidden @[200px]:block flex-1">
        <div className="flex justify-between items-center">
          <h1 className="text-white @[310px]:text-lg">{chat?.name}</h1>
          <p className="text-light-gray/50 text-xs @[310px]:text-sm">Sent ✔</p>
        </div>
        <p className="hidden @[325px]:inline-block text-light-gray/50 text-ellipsis whitespace-nowrap overflow-hidden w-60">
          {chat?.lastMessage?.message}
        </p>
      </div>
    </Link>
  );
}

export default ChatItem;

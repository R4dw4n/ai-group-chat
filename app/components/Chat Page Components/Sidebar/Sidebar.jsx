import React from "react";
import SearchChat from "./SearchChat";
import ChatItem from "./ChatItem";
import Image from "next/image";
import { icons, images } from "@/app/utilities/assets";
import ResizableDiv from "@/app/utilities/ResizableDiv";

const chatItems = [
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
  {
    profilePic: images.PROFILE,
    chatName: "Radwan Al-Kheder",
    lastMessage:
      "This is the last message This is the last message This is the last message",
  },
];

function Sidebar({ groups }) {
  return (
    <ResizableDiv className="h-screen bg-dark-gray @container" initialWidth={400}>
      <div className="flex gap-2 p-4 items-center">
        <Image
          alt="menu"
          src={icons.BURGER}
          priority
          className="cursor-pointer h-8 w-8"
        />
        <SearchChat className="hidden @[100px]:block" />
      </div>
      <div className="overflow-y-auto w-full h-[calc(100vh-80px)]">
        {groups.map((chat, ind) => (
          <ChatItem chat={chat} key={ind} />
        ))}
      </div>
    </ResizableDiv>
  );
}

export default Sidebar;

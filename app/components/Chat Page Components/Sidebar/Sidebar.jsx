'use client';
import React, { useState, useEffect } from "react";
import SearchChat from "./SearchChat";
import ChatItem from "./ChatItem";
import Image from "next/image";
import { icons, images } from "@/app/utilities/assets";
import ResizableDiv from "@/app/utilities/ResizableDiv";

function Sidebar({ groups }) {
  const [filteredGroups, setFilteredGroups] = useState(groups);
  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);
  return (
    <ResizableDiv className="h-screen bg-dark-gray @container" initialWidth={400}>
      <div className="flex gap-2 p-4 items-center">
        <Image
          alt="menu"
          src={icons.BURGER}
          priority
          className="cursor-pointer h-8 w-8"
        />
        <SearchChat className="hidden @[100px]:block" setFilteredGroups={setFilteredGroups} groups={groups} />
      </div>
      <div className="overflow-y-auto w-full h-[calc(100vh-80px)]">
        {filteredGroups.map((chat, ind) => (
          <ChatItem chat={chat} key={ind} />
        ))}
      </div>
    </ResizableDiv>
  );
}

export default Sidebar;

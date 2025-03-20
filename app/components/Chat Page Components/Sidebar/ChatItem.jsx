import Image from "next/image";
import React from "react";

function ChatItem({ chat }) {
  return (
    <div className="flex items-center justify-center px-4 py-2 w-full">
      <div className="overflow-hidden flex rounded-full w-12 h-12">
        {chat?.profilePic && <Image alt="profile-pic" src={chat?.profilePic} />}
      </div>
      <div className="p-2 hidden @[200px]:block flex-1">
        <div className="flex justify-between items-center">
          <h1 className="text-white @[310px]:text-lg">{chat?.chatName}</h1>
          <p className="text-light-gray/50 text-xs @[310px]:text-sm">Sent ✔</p>
        </div>
        <p className="hidden @[325px]:inline-block text-light-gray/50 text-ellipsis whitespace-nowrap overflow-hidden w-60">
          {chat?.lastMessage}
        </p>
      </div>
    </div>
  );
}

export default ChatItem;

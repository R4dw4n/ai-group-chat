'use client'
import Chat from "@/app/components/Chat Page Components/Chat/Chat";
import Sidebar from "@/app/components/Chat Page Components/Sidebar/Sidebar";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const chatId = useSearchParams().get('chatId')
  console.log(chatId)
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      {chatId === null ? (
        <h1 className="text-center m-auto text-6xl text-white py-24">
          Start Chatting!
        </h1>
      ) : (
        <Chat chatId={chatId} />
      )}
    </div>
  );
}

export default Page;

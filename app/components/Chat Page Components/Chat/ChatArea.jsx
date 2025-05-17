"use client";
import React, { useState, useRef } from "react";
import ChatInput from "./ChatInput";
import Image from "next/image";
import { icons } from "@/app/utilities/assets";
import Message from "./Message";

function ChatArea() {
  const ref = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [textareaHeight, setTextareaHeight] = useState(40); // Track textarea height

  const maxTextareaHeight = 200; // Set a maximum height for the textarea

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Adjust the height of this div dynamically */}
      <div
        className="w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
        style={{
          height: `calc(100vh - 120px - ${Math.min(
            textareaHeight,
            maxTextareaHeight
          )}px)`, // Subtract textarea height from the div height
        }}
      >
        {messages.map((item, ind) => (
          <Message key={ind} message={item} />
        ))}
      </div>
      <div className="flex gap-4 px-4 py-2 bg-dark-gray rounded-4xl mt-2">
        <ChatInput
          inputRef={ref}
          setText={setMessage}
          text={message}
          textareaHeight={textareaHeight}
          setTextareaHeight={setTextareaHeight}
          maxHeight={maxTextareaHeight} // Pass maxHeight to ChatInput
        />
        <Image
          className="h-5 w-5 cursor-pointer hover:text-white mt-3"
          alt="send"
          src={icons.SEND}
          onClick={() => {
            setMessages([
              ...messages,
              {
                from: 0,
                time:
                  new Date().getHours().toString() +
                  ":" +
                  new Date().getMinutes().toString(),
                content: message,
              },
            ]);
            setMessage("");
            ref.current.style.height = 'auto'
            setTextareaHeight(40); // Reset textarea height after sending
          }}
        />
      </div>
    </div>
  );
}

export default ChatArea;

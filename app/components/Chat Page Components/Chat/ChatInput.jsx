"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

function ChatInput({ text, setText, textareaHeight, setTextareaHeight, maxHeight, inputRef }) {
  const { t } = useTranslation();
  const handleInput = (event) => {
    setText(event.target.value);
    const textarea = inputRef.current;
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    setTextareaHeight(textarea.scrollHeight);
  };
  console.log("height: ", textareaHeight)
  return (
    <textarea
      ref={inputRef}
      className="w-full px-4 py-2 placeholder-light-gray/60 text-white outline-none resize-none" 
      placeholder={t("type_message")}
      value={text}
      rows={1}
      onInput={handleInput}
      style={{
        maxHeight: `${maxHeight}px`,
        overflow: textareaHeight >= maxHeight ? "auto": "hidden"
      }}
    />
  );
}

export default ChatInput;

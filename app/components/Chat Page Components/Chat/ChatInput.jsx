"use client";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function ChatInput({ text, setText, textareaHeight, setTextareaHeight, maxHeight, inputRef, sendMessage }) {
  const { t } = useTranslation();
  const handleInput = (event) => {
    setText(event.target.value);
    const textarea = inputRef.current;
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    setTextareaHeight(textarea.scrollHeight);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default new line behavior
      if (text.trim()) { // Only send if there's actual content
        sendMessage();
      }
    }
    // Shift+Enter will allow default behavior (new line)
  };

  return (
    <textarea
      ref={inputRef}
      className="w-full px-4 py-2 placeholder-light-gray/60 text-white outline-none resize-none" 
      placeholder={t("type_message")}
      value={text}
      rows={1}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      style={{
        maxHeight: `${maxHeight}px`,
        overflow: textareaHeight >= maxHeight ? "auto": "hidden"
      }}
    />
  );
}

export default ChatInput;

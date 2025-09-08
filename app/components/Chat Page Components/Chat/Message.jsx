"use client";
import { images } from "@/app/utilities/assets";
import Image from "next/image";
import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// Context to track if we're inside an ordered list
const OrderedListContext = createContext(false);

// Custom CodeBlock component with copy functionality
const CodeBlock = ({ children }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const getTextToCopy = (element) => {
      if (typeof element === "string") {
        return element;
      }
      if (typeof element === "number") {
        return element.toString();
      }
      if (Array.isArray(element)) {
        return element.map(getTextToCopy).join("");
      }
      if (element && typeof element === "object" && element.props) {
        return getTextToCopy(element.props.children);
      }
      return "";
    };

    try {
      // Extract text content from the code element
      const textToCopy = getTextToCopy(children);
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-800 text-green-400 p-3 rounded-lg overflow-x-auto text-sm font-mono my-2">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 end-3 bg-transparent text-navigation-gray hover:text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 cursor-pointer"
        title={copied ? t("copied") : t("copy")}
      >
        {copied ? (
          <>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {t("copied")}
          </>
        ) : (
          <>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {t("copy")}
          </>
        )}
      </button>
    </div>
  );
};

const messageTail = {
  0: "-right-1 border-b-dark-gray",
  1: "-left-1 border-b-gray",
  2: "hidden",
};
const messageStyle = {
  0: "bg-dark-gray max-w-42",
  1: "bg-gray max-w-42",
  2: "bg-[#0D1117] max-w-[90%]",
};
const messageDirection = {
  0: "self-end",
  1: "",
  2: "",
  center: "self-center",
};
const timeStyle = {
  0: "text-gray",
  1: "text-dark-gray/75",
  2: "text-gray",
};
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Custom markdown component with chat-appropriate styling
const MarkdownContent = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customize heading styles
          hr: () => (
            <>
              <br />
              <hr className="border-gray-500" />
              <br />
            </>
          ),
          h1: ({ children }) => (
            <>
              <br />
              <h1 className="text-white text-3xl font-bold mb-2">{children}</h1>
              <br />
            </>
          ),
          h2: ({ children }) => (
            <>
              <br />
              <h2 className="text-white text-2xl font-bold mb-1">{children}</h2>
              <br />
            </>
          ),
          h3: ({ children }) => (
            <>
              <br />
              <h3 className="text-white text-xl font-bold mb-1">{children}</h3>
              <br />
            </>
          ),

          // Customize paragraph styles
          p: ({ children }) => (
            <p className="text-white mb-2 last:mb-0 inline">{children}</p>
          ),

          // Customize code styles
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-700 text-green-400 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },

          // Customize pre/code block styles
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

          // Customize list styles
          ul: ({ children }) => (
            <OrderedListContext.Provider value={false}>
              <ul className="text-white list-disc list-inside mb-2 space-y-1">
                {children}
              </ul>
            </OrderedListContext.Provider>
          ),
          ol: ({ children }) => (
            <OrderedListContext.Provider value={true}>
              <br />
              <ol className="text-white list-decimal list-inside mb-2 space-y-1">
                {children}
              </ol>
            </OrderedListContext.Provider>
          ),
          li: ({ children }) => {
            const isInOrderedList = useContext(OrderedListContext);
            return (
              <li className="text-white">
                {children}
                {isInOrderedList && <br />}
              </li>
            );
          },

          // Customize link styles
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),

          // Customize blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-300 my-2">
              {children}
            </blockquote>
          ),

          // Customize table styles
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 bg-gray-700 text-white px-2 py-1 text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 text-white px-2 py-1">
              {children}
            </td>
          ),

          // Customize strong/bold styles
          strong: ({ children }) => (
            <strong className="text-white font-bold">{children}</strong>
          ),

          // Customize emphasis/italic styles
          em: ({ children }) => (
            <em className="text-white italic">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

function Message({ message, user }) {
  const { t } = useTranslation();
  const actionMessage = {
    au: t("joined"),
    ul: t("left"),
    ru: t("removed"),
    r: t("group_renamed"),
    room_changed_avatar: t("room_changed_avatar"),
  };
  const groupStateMessage = (
    <div
      className={`min-w-18 relative text-white text-xs py-1 px-2 rounded-full ${
        messageStyle[message.from]
      }`}
    >
      <div className="flex items-center gap-2">
        <h5 className="text-white max-w-full break-words">
          {message?.content} {actionMessage[message.type]}
        </h5>
        <h5 className={`${timeStyle[message.from]}`}>
          {formatTime(message?.time)}
        </h5>
      </div>
    </div>
  );

  const normalMessage = (
    <>
      <div className="flex overflow-hidden w-12 h-12 rounded-full">
        {message.from !== 0 && (
          <Image
            alt="profile-pic"
            src={user.avatarUrl ?? images.PROFILE}
            width={48}
            height={48}
            unoptimized={!user?.avatarUrl?.includes("etag")}
          />
        )}
      </div>
      <div
        className={`min-w-32 relative text-white py-2 px-3 rounded-3xl ${
          messageStyle[message.from]
        }`}
      >
        <div
          className={`absolute ${
            messageTail[message.from]
          } bottom-0.5 w-0 h-0 border-l-[13px] border-l-transparent border-r-[13px] border-r-transparent border-b-[13px]`}
        ></div>
        {user.name && (
          <h1 className="text-[#1e7ab4] text-lg max-w-full break-words block mb-1">
            {user.name}
          </h1>
        )}
        <div className="text-white max-w-full break-words">
          <MarkdownContent content={message?.content} />
        </div>
        <h5 className={`${timeStyle[message.from]}`}>
          {formatTime(message?.time)}
        </h5>
      </div>
    </>
  );

  return (
    <div
      className={`min-w-36 my-2 flex gap-5 ${
        messageDirection[message.type === "normal" ? message.from : "center"]
      }`}
    >
      {message.type === "normal" ? normalMessage : groupStateMessage}
    </div>
  );
}

export default Message;

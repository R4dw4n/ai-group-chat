"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatInput from "./ChatInput";
import Image from "next/image";
import { icons, images } from "@/app/utilities/assets";
import Message from "./Message";
import { groupsService } from "@/app/api/services/groupsService";
import { messages as messagesF } from "@/app/utilities/messages";
function ChatArea({
  chatId,
  chatService,
  receivedMessage,
  members,
  setMembers,
}) {
  const ref = useRef(null);
  const chatContainerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [textareaHeight, setTextareaHeight] = useState(40); // Track textarea height
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const maxTextareaHeight = 200; // Set a maximum height for the textarea

  const fetchMessages = async (page) => {
    const result = await groupsService.getMessages(chatId, {
      count: 50,
      offset: page * 50,
    });
    return result;
  };

  const resetState = () => {
    setHasMore(true);
    setMessages([]);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages([
      ...messages,
      {
        from: 0,
        time: new Date(),
        content: message.trim(),
        user: {
          name: localStorage.getItem("username"),
        },
        type: "normal",
      },
    ]);
    chatService.sendMessage(chatId, message.trim());
    setMessage("");
    ref.current.style.height = "auto";
    setTextareaHeight(40); // Reset textarea height after sending
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        console.log(
          chatContainerRef.current.scrollTop,
          chatContainerRef.current.scrollHeight
        );
      }
    }, 10);
  };

  // Load initial messages
  useEffect(() => {
    resetState();

    const username = localStorage.getItem("username");
    const loadInitialMessages = async () => {
      setLoading(true);
      try {
        const result = await fetchMessages(0);
        setMessages(
          result.data
            .map((msg) => {
              return {
                ...msg,
                content: msg.message,
                from: msg.sender === username ? 0 : msg.sender === "ai-general" ? 2 : 1,
                time: msg.timestamp,
              };
            })
            .reverse()
        ); // Reverse for chronological order
        setPage(1);
      } catch (error) {
        messagesF("error", error.response.data.message, 2);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();
  }, [chatId]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    const username = localStorage.getItem("username");
    if (loading || !hasMore || page === 0) return;

    setLoading(true);
    const container = chatContainerRef.current;
    const previousScrollHeight = container.scrollHeight;

    try {
      const result = await fetchMessages(page);
      const newMessages = result.data.reverse();
      setHasMore(result.data.length > 0);

      setMessages((prev) => {
        let res = newMessages.map((msg) => {
          return {
            ...msg,
            content: msg.message,
            from: msg.sender === username ? 0 : msg.sender === "ai-general" ? 2 : 1,
            time: msg.timestamp,
          };
        });
        return [...res, ...prev];
      });
      setPage((prev) => prev + 1);

      // Maintain scroll position after prepending messages
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - previousScrollHeight;
        console.log(previousScrollHeight, newScrollHeight, container.scrollTop);
        container.scrollTop += scrollDiff - 64;
      }, 10);
    } catch (error) {
      messagesF("error", error.response.data.message, 2);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const threshold = 50; // Load more when within 100px of top

    if (scrollTop <= threshold && !loading) {
      loadMoreMessages();
    }
  }, [loading, loadMoreMessages]);

  // Attach scroll listener
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (messages.length <= 50 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    if (
      receivedMessage &&
      receivedMessage.rid === chatId &&
      chatContainerRef.current
    ) {
      const container = chatContainerRef.current;
      const previousScrollHeight = container.scrollHeight,
        previousScrollTop = container.scrollTop;
      console.log(receivedMessage);
      let addedMessage = { ...receivedMessage };
      if (receivedMessage.u && receivedMessage.u._id) {
        addedMessage.user = {
          ...receivedMessage.u,
        };
      } else {
        addedMessage.user = {};
      }
      if (receivedMessage.t) {
        addedMessage.type = receivedMessage.t;
      } else {
        addedMessage.type = "normal";
      }
      setMessages([
        ...messages,
        {
          ...addedMessage,
          avatarUrl:
            members.find((member) => member._id === addedMessage.user._id)
              ?.avatarUrl ?? images.PROFILE,
          from: addedMessage.user?.username === "ai-general" ? 2 : 1,
          time: new Date(receivedMessage.ts.$date),
          content: receivedMessage.msg,
        },
      ]);
      setTimeout(() => {
        if (previousScrollHeight === previousScrollTop) {
          container.scrollTop = container.scrollHeight;
        }
      }, 10);
    }
  }, [receivedMessage]);

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Adjust the height of this div dynamically */}
      <div
        ref={chatContainerRef}
        className="w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden"
        style={{
          height: `calc(100vh - 120px - ${Math.min(
            textareaHeight,
            maxTextareaHeight
          )}px)`, // Subtract textarea height from the div height
        }}
      >
        {/* /* Loading indicator at top */}
        {loading && messages.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="bg-dark-gray text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading more messages...</span>
            </div>
          </div>
        )}
        {messages.map((item, ind) => (
          <Message key={ind} message={item} user={item.user} />
        ))}
        {/* Initial loading */}
        {messages.length === 0 && loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray">Loading chat messages...</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4 px-4 py-2 bg-dark-gray rounded-4xl mt-2">
        <ChatInput
          inputRef={ref}
          setText={setMessage}
          text={message}
          textareaHeight={textareaHeight}
          setTextareaHeight={setTextareaHeight}
          maxHeight={maxTextareaHeight} // Pass maxHeight to ChatInput
          sendMessage={sendMessage}
        />
        <Image
          className="h-5 w-5 cursor-pointer hover:text-white mt-3"
          alt="send"
          src={icons.SEND}
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default ChatArea;

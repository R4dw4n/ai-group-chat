"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatInput from "./ChatInput";
import Image from "next/image";
import { icons, images } from "@/app/utilities/assets";
import Message from "./Message";
import { groupsService } from "@/app/api/services/groupsService";
import { messages as messagesF } from "@/app/utilities/messages";
import { Upload } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import { getUser } from "@/app/utilities/tokenManager";
function ChatArea({
  chatId,
  chatService,
  receivedMessage,
  members,
  setMembers,
}) {
  const ref = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

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
          name: getUser()?.name,
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
      }
    }, 10);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      messagesF("error", "File type not supported", 2);
      return;
    }

    try {
      // Send file via chat service
      setMessages((prev) => [
        ...prev,
        {
          from: 0,
          time: new Date(),
          content: ``,
          user: {
            name: getUser()?.name,
          },
          type: "image",
          attachments: [
            {
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
              image_url: URL.createObjectURL(file),
            },
          ],
        },
      ]);
      await chatService.sendImage(chatId, file);

      // Update the temporary message to show success

      // Clear the file input
      event.target.value = "";
      ref.current.style.height = "auto";
      setTextareaHeight(40); // Reset textarea height after sending
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 10);
    } catch (error) {
      console.error("File upload error:", error);
      messagesF("error", "Failed to upload file", 2);
    }
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
              if (msg.attachments && msg.attachments.length > 0) {
                msg.type = "image";
                msg.attachments = msg.attachments.map((attachment) => {
                  return {
                    ...attachment,
                    url: "https://45-159-248-44.nip.io" + attachment.image_url,
                    image_url:
                      "https://45-159-248-44.nip.io" + attachment.image_url,
                  };
                });
              }
              return {
                ...msg,
                content: msg.message,
                from:
                  msg.sender === username
                    ? 0
                    : msg.sender === "ai-general"
                    ? 2
                    : 1,
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
          if (msg.attachments && msg.attachments.length > 0) {
            msg.type = "image";
            msg.attachments = msg.attachments.map((attachment) => {
              return {
                ...attachment,
                url: "https://45-159-248-44.nip.io" + attachment.image_url,
                image_url:
                  "https://45-159-248-44.nip.io" + attachment.image_url,
              };
            });
          }
          return {
            ...msg,
            content: msg.message,
            from:
              msg.sender === username ? 0 : msg.sender === "ai-general" ? 2 : 1,
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
      addedMessage.user.avatarUrl = members.find(
        (member) => member._id === addedMessage.user._id
      )?.avatarUrl;

      if (
        receivedMessage.attachments &&
        receivedMessage.attachments.length > 0
      ) {
        addedMessage.attachments = receivedMessage.attachments.map(
          (attachment) => {
            return {
              ...attachment,
              url: "https://45-159-248-44.nip.io" + attachment.image_url,
              image_url: "https://45-159-248-44.nip.io" + attachment.image_url,
            };
          });
        addedMessage.type = "image";
      }

      setMessages([
        ...messages,
        {
          ...addedMessage,
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
        className="w-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden px-4"
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
      <div className="flex gap-3 px-4 py-2 bg-dark-gray rounded-4xl mt-2 text-navigation-gray">
        <ChatInput
          inputRef={ref}
          setText={setMessage}
          text={message}
          textareaHeight={textareaHeight}
          setTextareaHeight={setTextareaHeight}
          maxHeight={maxTextareaHeight} // Pass maxHeight to ChatInput
          sendMessage={sendMessage}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <PaperClipOutlined
          className="h-8 w-8 cursor-pointer text-navigation-gray hover:text-white mt-[5px]"
          onClick={handleFileUpload}
          style={{ fontSize: "22px" }}
        />
        <Image
          className="h-5 w-5 cursor-pointer hover:text-white mt-3 me-2"
          alt="send"
          src={icons.SEND}
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default ChatArea;

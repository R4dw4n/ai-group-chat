import React from "react";
import ChatToolbar from "./ChatToolbar";
import ChatArea from "./ChatArea";

function Chat({ chatId, chatService, receivedMessage }) {
  return (
    <div className="h-screen flex-1">
      <ChatToolbar />
      <ChatArea
        chatId={chatId}
        chatService={chatService}
        receivedMessage={receivedMessage}
      />
    </div>
  );
}

export default Chat;

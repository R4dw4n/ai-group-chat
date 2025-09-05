import React, { useEffect, useState } from "react";
import ChatToolbar from "./ChatToolbar";
import ChatArea from "./ChatArea";
import { messages } from "@/app/utilities/messages";
import Loading from "@/app/utilities/Loading";
import { groupsService } from "@/app/api/services/groupsService";

function Chat({ chatId, chatService, receivedMessage }) {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const getGroup = async () => {
      try {
        setLoading(true);
        const res = await groupsService.getGroup(chatId);
        setGroup(res.data);
      } catch (error) {
        messages("error", error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getGroup();
    const getMembers = async () => {
      try {
        setLoading(true);
        const res = await groupsService.getMembers(chatId);
        setMembers(res.data);
      } catch (error) {
        messages("error", error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getMembers();
  }, [chatId]);
  return (
    <div className="h-screen flex-1">
      {loading ? (
        <Loading isLoading={loading} fullscreen />
      ) : (
        <>
          {group !== null ? (
            <>
              <ChatToolbar
                group={group}
                setGroup={setGroup}
                chatId={chatId}
                members={members}
                setMembers={setMembers}
                />
              <ChatArea
                chatId={chatId}
                chatService={chatService}
                members={members}
                setMembers={setMembers}
                receivedMessage={receivedMessage}
              />
            </>
          ) : (
            <h1>Error Please Refresh</h1>
          )}
        </>
      )}
    </div>
  );
}

export default Chat;

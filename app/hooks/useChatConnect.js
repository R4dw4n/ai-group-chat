import { useEffect, useState } from 'react'
import { RocketChatService } from '../sockets/rocketChatService';

const useChatConnect = () => {
  const [chatService, setChatService] = useState(null); // Rocket Chat Service
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const authToken = localStorage?.getItem("chatToken");
    const username = localStorage?.getItem("username");
    const user = JSON.parse(localStorage?.getItem("user"));
    if (!authToken) {
      console.error("No auth token available");
      return;
    }
    const rocketChatService = new RocketChatService(authToken, username, user.id);
    setChatService(rocketChatService);
    const connectionSub = rocketChatService
      .isConnected()
      .subscribe((_connected) => {
        setConnected(_connected);
      });
    return () => {
      connectionSub.unsubscribe();
    };
  }, [])
  return { connected, chatService };
}

export default useChatConnect
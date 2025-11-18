"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/lib/api";

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_type: "restaurant" | "support";
  sender_id: string;
  message: string;
  photo_url?: string;
  created_at: string;
  read: boolean;
}

export interface ChatRequest {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  status: "pending" | "active" | "closed";
  created_at: string;
  accepted_by?: string;
  last_message?: ChatMessage;
  unread_count?: number;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  chatQueue: ChatRequest[];
  activeChats: ChatRequest[];
  currentChat: ChatRequest | null;
  messages: ChatMessage[];
  isTyping: boolean;
  acceptChat: (chatId: string) => void;
  sendMessage: (chatId: string, message: string, photoUrl?: string) => void;
  closeChat: (chatId: string) => void;
  setCurrentChat: (chat: ChatRequest | null) => void;
  sendTypingIndicator: (chatId: string, isTyping: boolean) => void;
}

export function useSocket(agentId: string): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatQueue, setChatQueue] = useState<ChatRequest[]>([]);
  const [activeChats, setActiveChats] = useState<ChatRequest[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!agentId) return;

    const token = localStorage.getItem("support-auth-token");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    const socket = io(WS_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    const fetchActiveSessions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:45000";
        const response = await fetch(`${apiUrl}/api/v1/chat/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const sessions = await response.json();
          const pending = sessions.filter((s: any) => s.status === "waiting");
          const active = sessions.filter((s: any) => s.status === "active" && s.agent_id === agentId);

          setChatQueue(pending.map((s: any) => ({
            id: s.id,
            restaurant_id: s.restaurant_id,
            restaurant_name: s.subject,
            status: s.status,
            created_at: s.created_at,
          })));

          setActiveChats(active.map((s: any) => ({
            id: s.id,
            restaurant_id: s.restaurant_id,
            restaurant_name: s.subject,
            status: s.status,
            created_at: s.created_at,
            accepted_by: s.agent_id,
          })));
        }
      } catch (error) {
        console.error("Error fetching active sessions:", error);
      }
    };

    fetchActiveSessions();

    socket.on("connect", () => {
      console.log("Support agent connected to socket");
      setIsConnected(true);
      fetchActiveSessions();
    });

    socket.on("disconnect", () => {
      console.log("Support agent disconnected");
      setIsConnected(false);
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    socket.on("session_status_changed", (data: any) => {
      console.log("Session status changed:", data);
      if (data.status === "active") {
        setChatQueue((prev) => prev.filter((chat) => chat.id !== data.session_id));
      }
    });

    socket.on("new_message", ({ message }: any) => {
      console.log("New message received:", message);
      if (currentChat && message.session_id === currentChat.id) {
        setMessages((prev) => [...prev, {
          id: message.id,
          chat_id: message.session_id,
          sender_type: message.sender_role === "support" ? "support" : "restaurant",
          sender_id: message.sender_id,
          message: message.content,
          photo_url: undefined,
          created_at: message.created_at,
          read: false,
        }]);
      }
    });

    socket.on("user_typing", ({ user_id }: any) => {
      if (currentChat && user_id !== agentId) {
        setIsTyping(true);
      }
    });

    socket.on("typing_stopped", ({ user_id }: any) => {
      if (currentChat && user_id !== agentId) {
        setIsTyping(false);
      }
    });

    socket.on("chat_accepted", ({ session, agent_id }: any) => {
      console.log("Chat accepted:", session, "by", agent_id);
      if (agent_id === agentId) {
        setActiveChats((prev) => [{
          id: session.id,
          restaurant_id: session.restaurant_id,
          restaurant_name: session.subject,
          status: "active",
          created_at: session.created_at,
          accepted_by: agent_id,
        }, ...prev]);
      }
    });

    socket.on("chat_closed", ({ session_id }: any) => {
      console.log("Chat closed:", session_id);
      setActiveChats((prev) => prev.filter((chat) => chat.id !== session_id));
      if (currentChat?.id === session_id) {
        setCurrentChat(null);
        setMessages([]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [agentId, currentChat]);

  useEffect(() => {
    if (currentChat && socketRef.current) {
      socketRef.current.emit("join_session", { session_id: currentChat.id });

      const handleSessionJoined = (data: any) => {
        console.log("Session joined:", data);
        const chatMessages: ChatMessage[] = data.messages.map((msg: any) => ({
          id: msg.id,
          chat_id: msg.session_id,
          sender_type: msg.sender_role === "support" ? "support" : "restaurant",
          sender_id: msg.sender_id,
          message: msg.content,
          photo_url: undefined,
          created_at: msg.created_at,
          read: false,
        }));
        setMessages(chatMessages);
      };

      socketRef.current.on("session_joined", handleSessionJoined);

      return () => {
        if (socketRef.current) {
          socketRef.current.emit("leave_session", { session_id: currentChat.id });
          socketRef.current.off("session_joined", handleSessionJoined);
        }
      };
    }
  }, [currentChat]);

  const acceptChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("accept_chat", { session_id: chatId });
    }
  };

  const sendMessage = (chatId: string, message: string, photoUrl?: string) => {
    if (socketRef.current && message.trim()) {
      socketRef.current.emit("send_message", {
        session_id: chatId,
        content: message,
        message_type: "text",
      });
    }
  };

  const closeChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("close_chat", { session_id: chatId });
    }
  };

  const sendTypingIndicator = (chatId: string, typing: boolean) => {
    if (socketRef.current) {
      if (typing) {
        socketRef.current.emit("typing", { session_id: chatId });
      } else {
        socketRef.current.emit("stop_typing", { session_id: chatId });
      }
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    chatQueue,
    activeChats,
    currentChat,
    messages,
    isTyping,
    acceptChat,
    sendMessage,
    closeChat,
    setCurrentChat,
    sendTypingIndicator,
  };
}

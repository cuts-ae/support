"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Store } from "lucide-react";
import { ChatRequest } from "@/hooks/useSocket";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface ActiveChatsListProps {
  chats: ChatRequest[];
  currentChatId: string | null;
  onSelectChat: (chat: ChatRequest) => void;
}

export function ActiveChatsList({
  chats,
  currentChatId,
  onSelectChat,
}: ActiveChatsListProps) {
  if (chats.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No active chats
        </h3>
        <p className="text-sm text-muted-foreground">
          Accept a chat from the queue to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className={cn(
            "p-4 cursor-pointer hover:shadow-md transition-all",
            currentChatId === chat.id
              ? "bg-primary/5 border-primary shadow-md"
              : "hover:bg-accent/50"
          )}
          onClick={() => onSelectChat(chat)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.restaurant_name}
                </h3>
              </div>
              
              {chat.last_message && (
                <p className="text-sm text-gray-600 truncate mb-1">
                  {chat.last_message.sender_type === "support" && "You: "}
                  {chat.last_message.message}
                </p>
              )}
              
              <div className="text-xs text-muted-foreground">
                {chat.last_message &&
                  formatDistanceToNow(new Date(chat.last_message.created_at), {
                    addSuffix: true,
                  })}
              </div>
            </div>
            
            {chat.unread_count && chat.unread_count > 0 && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                {chat.unread_count}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

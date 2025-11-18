"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, Store } from "lucide-react";
import { ChatRequest } from "@/hooks/useSocket";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface ChatQueueProps {
  queue: ChatRequest[];
  onAccept: (chatId: string) => void;
}

export function ChatQueue({ queue, onAccept }: ChatQueueProps) {
  if (queue.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No pending chats
        </h3>
        <p className="text-sm text-muted-foreground">
          New chat requests will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {queue.map((chat) => (
        <Card
          key={chat.id}
          className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.restaurant_name}
                </h3>
              </div>
              
              {chat.last_message && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {chat.last_message.message}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(chat.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => onAccept(chat.id)}
              size="sm"
              className="flex-shrink-0"
            >
              Accept
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

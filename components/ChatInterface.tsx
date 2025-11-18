"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Send,
  X,
  Image as ImageIcon,
  Loader2,
  Store,
  CheckCircle2,
} from "lucide-react";
import { ChatRequest, ChatMessage } from "@/hooks/useSocket";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  chat: ChatRequest;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string, photoUrl?: string) => void;
  onClose: () => void;
  onTyping: (isTyping: boolean) => void;
}

export function ChatInterface({
  chat,
  messages,
  isTyping,
  onSendMessage,
  onClose,
  onTyping,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (value.length > 0) {
      onTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    } else {
      onTyping(false);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    onSendMessage(message.trim());
    setMessage("");
    onTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {chat.restaurant_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Active since{" "}
              {formatDistanceToNow(new Date(chat.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onClose}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Close Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender_type === "support" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg p-3",
                msg.sender_type === "support"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border border-gray-200"
              )}
            >
              {msg.photo_url && (
                <img
                  src={msg.photo_url}
                  alt="Attached"
                  className="rounded-lg mb-2 max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(msg.photo_url || null)}
                />
              )}
              
              <p className="text-sm whitespace-pre-wrap break-words">
                {msg.message}
              </p>
              
              <div
                className={cn(
                  "flex items-center gap-1 mt-1 text-xs",
                  msg.sender_type === "support"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                <span>
                  {formatDistanceToNow(new Date(msg.created_at), {
                    addSuffix: true,
                  })}
                </span>
                {msg.sender_type === "support" && msg.read && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[200px] resize-none"
            rows={2}
          />
          
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-shrink-0 h-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      {/* Image viewer dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>Image</DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

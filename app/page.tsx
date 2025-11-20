"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, MessageSquare, Clock, CheckCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSocket } from "@/hooks/useSocket";
import { ChatQueue } from "@/components/ChatQueue";
import { ActiveChatsList } from "@/components/ActiveChatsList";
import { ChatInterface } from "@/components/ChatInterface";

export default function SupportPortal() {
  const router = useRouter();
  const [agentId, setAgentId] = useState<string>("");
  const [agentEmail, setAgentEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
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
  } = useSocket(agentId);

  useEffect(() => {
    const token = localStorage.getItem("support-auth-token");
    const agent = localStorage.getItem("support-agent");

    if (!token || !agent) {
      router.push("/login");
      return;
    }

    try {
      const agentData = JSON.parse(agent);
      setAgentId(agentData.id || agentData.email);
      setAgentEmail(agentData.email || "Support Agent");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to parse agent data:", error);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("support-auth-token");
    localStorage.removeItem("support-agent");
    router.push("/login");
  };

  const handleAcceptChat = (chatId: string) => {
    acceptChat(chatId);
  };

  const handleSendMessage = (message: string, photoUrl?: string) => {
    if (currentChat) {
      sendMessage(currentChat.id, message, photoUrl);
    }
  };

  const handleCloseChat = () => {
    if (currentChat) {
      closeChat(currentChat.id);
      setCurrentChat(null);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (currentChat) {
      sendTypingIndicator(currentChat.id, typing);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="relative border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Cuts.ae" className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                  Support Portal
                </h1>
                <div className="flex items-center gap-2 text-xs mt-0.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${"${"}isConnected ? "bg-green-500" : "bg-gray-400"${"}"}`}
                  />
                  <span className="text-gray-500">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-700">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>{agentEmail}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1800px] mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Chats
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatQueue.length}</div>
              <p className="text-xs text-muted-foreground">Waiting for agent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Chats
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeChats.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently handling
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Resolved chats</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs defaultValue="queue" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="queue" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Queue ({chatQueue.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Active ({activeChats.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="mt-4">
                <ChatQueue queue={chatQueue} onAccept={handleAcceptChat} />
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <ActiveChatsList
                  chats={activeChats}
                  currentChatId={currentChat?.id || null}
                  onSelectChat={setCurrentChat}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-2">
            {currentChat ? (
              <div className="h-[calc(100vh-300px)]">
                <ChatInterface
                  chat={currentChat}
                  messages={messages}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  onClose={handleCloseChat}
                  onTyping={handleTyping}
                />
              </div>
            ) : (
              <Card className="h-[calc(100vh-300px)] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No chat selected
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Select a chat from your active chats or accept a new chat
                      from the queue
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

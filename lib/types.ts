export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customer: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  hasUnread: boolean;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "agent";
  };
  attachments?: Attachment[];
  isRead: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export interface TypingIndicator {
  ticketId: string;
  userId: string;
  userName: string;
}

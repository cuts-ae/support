export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "pending" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  restaurant_id?: string;
  restaurant_name?: string;
  restaurant_email?: string;
  restaurant_phone?: string;
  created_at: string;
  updated_at: string;
  reply_count?: number;
  last_reply_at?: string;
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id?: string;
  message: string;
  is_internal: boolean;
  author_name?: string;
  author_email?: string;
  created_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  restaurant_id?: string;
}

export interface AddReplyRequest {
  message: string;
  is_internal?: boolean;
}

export interface UpdateStatusRequest {
  status: "open" | "in_progress" | "pending" | "closed";
}

export interface UpdatePriorityRequest {
  priority: "low" | "medium" | "high" | "urgent";
}

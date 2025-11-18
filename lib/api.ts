export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:45000";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:45000";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/v1/support/auth/login`,
  },
  chat: {
    queue: `${API_URL}/api/v1/support/chat/queue`,
    active: `${API_URL}/api/v1/support/chat/active`,
    history: (chatId: string) => `${API_URL}/api/v1/support/chat/${chatId}/history`,
    accept: (chatId: string) => `${API_URL}/api/v1/support/chat/${chatId}/accept`,
    close: (chatId: string) => `${API_URL}/api/v1/support/chat/${chatId}/close`,
    sendMessage: (chatId: string) => `${API_URL}/api/v1/support/chat/${chatId}/message`,
  },
};

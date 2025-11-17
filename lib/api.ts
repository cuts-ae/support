export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:45000";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/v1/auth/login`,
  },
  support: {
    tickets: `${API_URL}/api/v1/support/tickets`,
    ticketDetails: (id: string) => `${API_URL}/api/v1/support/tickets/${id}`,
    messages: (ticketId: string) =>
      `${API_URL}/api/v1/support/tickets/${ticketId}/messages`,
    sendMessage: (ticketId: string) =>
      `${API_URL}/api/v1/support/tickets/${ticketId}/messages`,
    uploadFile: (ticketId: string) =>
      `${API_URL}/api/v1/support/tickets/${ticketId}/upload`,
    updateStatus: (ticketId: string) =>
      `${API_URL}/api/v1/support/tickets/${ticketId}/status`,
  },
};

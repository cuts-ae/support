# Support Agent Portal

A real-time support agent portal for managing customer chat requests from restaurants using the Cuts.ae platform.

## Features

- **Live Chat Queue**: View incoming chat requests from restaurants in real-time
- **Accept & Manage Chats**: Accept pending chats and handle multiple conversations simultaneously
- **Real-time Communication**: Built on Socket.io for instant message delivery
- **Typing Indicators**: See when restaurants are typing responses
- **Photo Viewing**: View photos shared by restaurants in full-screen mode
- **Chat History**: Access complete conversation history for each chat
- **Active Chats Dashboard**: Manage all your active conversations in one place
- **Close/Resolve Chats**: Mark conversations as resolved when issues are addressed
- **Professional UI**: Clean, responsive design matching the admin portal aesthetics

## Tech Stack

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features including Server Components
- **Socket.io Client**: Real-time bidirectional event-based communication
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **date-fns**: Modern JavaScript date utility library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend Socket.io server running on port 45000 (or configured WS_URL)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (create `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:45000
NEXT_PUBLIC_WS_URL=http://localhost:45000
```

3. Run the development server:
```bash
npm run dev
```

The portal will be available at `http://localhost:45003`

### Production Build

```bash
npm run build
npm start
```

## Usage

### Login

Use support agent credentials to log in:
- Email: agent@cuts.ae
- Password: TabsTriggerIsnt2026*$ (demo)

### Managing Chats

1. **Queue Tab**: View pending chat requests waiting for an agent
2. **Accept Chat**: Click "Accept" on any pending chat to claim it
3. **Active Tab**: Switch to active chats to see all your ongoing conversations
4. **Chat Interface**: Select a chat to view messages and respond
5. **Close Chat**: Click "Close Chat" when the issue is resolved

### Real-time Features

- New chat requests appear automatically in the queue
- Messages are delivered instantly
- Typing indicators show when the restaurant is typing
- Unread message counts update in real-time

## Socket.io Events

### Emitted Events (Agent → Server)

- `support:join` - Agent connects and joins support room
- `support:accept_chat` - Accept a pending chat request
- `support:send_message` - Send a message to restaurant
- `support:typing` - Send typing indicator
- `support:close_chat` - Close/resolve a chat
- `support:load_chat` - Load chat history

### Received Events (Server → Agent)

- `chat:new_request` - New chat request from restaurant
- `chat:accepted` - Chat was accepted (by this or another agent)
- `chat:message` - New message in a chat
- `chat:typing` - Restaurant is typing
- `chat:closed` - Chat was closed
- `chat:queue_update` - Queue updated
- `chat:active_update` - Active chats updated
- `chat:history` - Chat message history

## Project Structure

```
support/
├── app/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main support dashboard
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── ChatQueue.tsx         # Pending chats queue
│   ├── ActiveChatsList.tsx   # Active chats list
│   └── ChatInterface.tsx     # Chat conversation UI
├── hooks/
│   └── useSocket.ts          # Socket.io hook
├── lib/
│   ├── api.ts                # API endpoints configuration
│   └── utils.ts              # Utility functions
└── package.json
```

## API Integration

The portal expects the following backend endpoints:

- `POST /api/v1/support/auth/login` - Agent authentication
- `GET /api/v1/support/chat/queue` - Get pending chats
- `GET /api/v1/support/chat/active` - Get active chats
- `GET /api/v1/support/chat/:id/history` - Get chat history
- `POST /api/v1/support/chat/:id/accept` - Accept a chat
- `POST /api/v1/support/chat/:id/message` - Send message
- `POST /api/v1/support/chat/:id/close` - Close chat

## Development

### Running in Development Mode

```bash
npm run dev
```

The app uses Turbopack for faster builds and hot module replacement.

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## Deployment

The support portal can be deployed to any Next.js hosting platform:

- **Vercel**: Automatic deployments with Git integration
- **Railway**: Deploy with Docker or Nixpacks
- **AWS/GCP/Azure**: Deploy using containerization

Make sure to set the correct environment variables for production:
- `NEXT_PUBLIC_API_URL` - Production backend API URL
- `NEXT_PUBLIC_WS_URL` - Production WebSocket server URL

## Contributing

This is a proprietary application. Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved

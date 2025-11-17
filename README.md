# Support Portal

Professional support ticket management and live chat system built with Next.js 15.

## Features

- Real-time ticket management
- Live chat interface with typing indicators
- Read receipts for messages
- File attachment support
- Status management (Open, In Progress, Resolved, Closed)
- Priority levels (Low, Medium, High, Urgent)
- Clean, minimal Next.js/Vercel-inspired design
- Responsive layout for mobile and desktop

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- date-fns for date formatting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API server running on port 45000

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (optional):

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:45000
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:45004](http://localhost:45004)

### Build

Build for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
support/
├── app/
│   ├── dashboard/
│   │   ├── chat/
│   │   │   └── [ticketId]/
│   │   │       └── page.tsx       # Chat interface
│   │   ├── tickets/
│   │   │   └── page.tsx           # Tickets list
│   │   ├── layout.tsx             # Dashboard layout
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── api.ts                     # API configuration
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # Utilities
├── package.json
├── tsconfig.json
└── next.config.ts
```

## API Integration

The application integrates with the backend API at port 45000. Key endpoints:

- `POST /api/v1/auth/login` - Authentication
- `GET /api/v1/support/tickets` - List tickets
- `GET /api/v1/support/tickets/:id` - Ticket details
- `GET /api/v1/support/tickets/:id/messages` - Get messages
- `POST /api/v1/support/tickets/:id/messages` - Send message
- `PATCH /api/v1/support/tickets/:id/status` - Update ticket status

## Features Details

### Real-time Updates

- Tickets list auto-refreshes every 5 seconds
- Messages auto-refresh every 2 seconds
- Typing indicators with 1-second timeout

### Chat Interface

- Support for text messages
- File attachments (upload and download)
- Read receipts (single check = sent, double check = read)
- Typing indicators
- Smooth scrolling to latest messages

### Ticket Management

- Filter by status (All, Open, In Progress, Resolved)
- Search by title, customer name, or email
- View ticket statistics
- Update ticket status
- Priority badges

## Demo Credentials

For development and testing:

- Email: `support@example.com`
- Password: `password123`

Note: These credentials are for demo purposes only.

## License

Private - All rights reserved

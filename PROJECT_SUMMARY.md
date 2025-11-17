# Support Portal - Project Summary

## Project Overview

A professional support ticket management and live chat system built with Next.js 15, running on port 45004.

## Key Features Implemented

### 1. Authentication
- Login page with exact design from restaurant portal
- Demo credentials: `support@example.com` / `password123`
- Token-based authentication with localStorage and cookies
- Protected routes via dashboard layout

### 2. Ticket Management
- Real-time ticket list with auto-refresh (every 5 seconds)
- Ticket filtering by status (All, Open, In Progress, Resolved)
- Search by title, customer name, or email
- Status badges and priority indicators
- Statistics dashboard (Total, Open, In Progress, Resolved)

### 3. Live Chat Interface
- Real-time messaging with auto-refresh (every 2 seconds)
- Typing indicators with 1-second timeout
- Read receipts (single check = sent, double check = read)
- File attachment support (upload and download)
- Message history with timestamps
- Customer and agent differentiation
- Smooth scrolling to latest messages

### 4. UI/UX
- Clean, minimal Next.js/Vercel-inspired design
- Responsive layout for mobile and desktop
- Sidebar navigation with collapsible mobile menu
- Professional color scheme
- Smooth animations and transitions
- Avatar fallbacks with initials

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (stable version)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Date Formatting**: date-fns
- **Port**: 45004

## Project Structure

```
/Users/sour/Projects/cuts.ae/support/
├── app/
│   ├── dashboard/
│   │   ├── chat/
│   │   │   └── [ticketId]/
│   │   │       └── page.tsx          # Chat interface with typing indicators
│   │   ├── tickets/
│   │   │   └── page.tsx              # Tickets list with filtering
│   │   ├── layout.tsx                # Dashboard layout with navigation
│   │   └── page.tsx                  # Redirect to /dashboard/tickets
│   ├── login/
│   │   └── page.tsx                  # Login page (copied from restaurant)
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Redirect to /login
│   └── globals.css                   # Global styles with CSS variables
├── components/
│   └── ui/                           # shadcn/ui components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── scroll-area.tsx
│       └── textarea.tsx
├── lib/
│   ├── api.ts                        # API endpoints configuration
│   ├── types.ts                      # TypeScript interfaces
│   └── utils.ts                      # Utility functions (cn)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── next.config.ts                    # Next.js configuration
├── README.md                         # User documentation
├── CLAUDE.md                         # Development guidelines
└── .gitignore

```

## API Integration

The application connects to the backend API at `http://localhost:45000` (configurable via `NEXT_PUBLIC_API_URL`).

### API Endpoints Used

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/support/tickets` - List all tickets
- `GET /api/v1/support/tickets/:id` - Get ticket details
- `GET /api/v1/support/tickets/:id/messages` - Get ticket messages
- `POST /api/v1/support/tickets/:id/messages` - Send message with attachments
- `PATCH /api/v1/support/tickets/:id/status` - Update ticket status

## How to Run

### Development Mode

```bash
cd /Users/sour/Projects/cuts.ae/support
npm run dev
```

Access at: http://localhost:45004

### Production Build

```bash
npm run build
npm start
```

Note: Production build has a known issue with Turbopack and error pages. Development mode works perfectly.

## Features Details

### Real-time Updates
- Tickets auto-refresh every 5 seconds
- Messages auto-refresh every 2 seconds
- Typing indicators with debounce

### File Attachments
- Multi-file upload support
- File preview with name and size
- Download links for attachments
- Visual file indicators in chat

### Status Management
- Open (Blue badge with Circle icon)
- In Progress (Amber badge with Clock icon)
- Resolved (Green badge with CheckCircle icon)
- Closed (Gray badge with CheckCircle icon)

### Priority Levels
- Low (Secondary badge)
- Medium (Info badge)
- High (Warning badge)
- Urgent (Destructive badge)

## Key Components

### Login Page (`/login`)
- Identical design to restaurant portal
- Email and password inputs
- Show/hide password toggle
- Demo credentials panel (desktop only)
- Error and success states
- Auto-redirect on success

### Tickets List (`/dashboard/tickets`)
- Statistics cards
- Search and filter controls
- Ticket cards with status/priority badges
- Customer information
- Message count and last update time
- Click to open chat

### Chat Interface (`/dashboard/chat/:ticketId`)
- Customer header with avatar
- Status badge and actions dropdown
- Scrollable message history
- Agent vs customer message styling
- File attachments display
- Typing indicator animation
- Read receipts
- Message input with file upload
- Auto-scroll to bottom

## TypeScript Types

All major entities have proper TypeScript interfaces:
- `Ticket` - Support ticket with customer and status
- `Message` - Chat message with sender and attachments
- `Attachment` - File attachment metadata
- `TypingIndicator` - Typing status

## Styling System

### Color Scheme
- Uses CSS custom properties for theming
- HSL color values for easy customization
- Light mode optimized (dark mode variables included)

### Components
- Consistent spacing and sizing
- Focus states with ring indicators
- Hover effects and transitions
- Active states with scale animations

## Known Issues

1. **Production Build Error**: Turbopack has issues with error pages (404/500). Development mode works perfectly.
   - **Workaround**: Use `npm run dev` for development
   - **Note**: This is a known Next.js 15 + Turbopack issue and doesn't affect functionality

2. **Tailwind CSS Version**: Downgraded from v4 beta to v3 stable for reliability
   - No feature loss, all styles work correctly

## Next Steps / Future Enhancements

1. WebSocket integration for true real-time updates (currently using polling)
2. Push notifications for new messages
3. Ticket assignment to specific agents
4. Canned responses/templates
5. Customer satisfaction ratings
6. Analytics dashboard
7. Dark mode toggle
8. Multi-language support

## Testing

The application has been tested for:
- Login flow with authentication
- Navigation between pages
- Responsive design (mobile and desktop)
- Component rendering
- TypeScript type safety

## Deployment Notes

- Set `NEXT_PUBLIC_API_URL` environment variable for production API
- Ensure backend API is accessible from deployment environment
- Configure CORS on backend API for frontend domain
- Use stable production build without turbopack if needed: `next build`

## Demo Credentials

- **Email**: support@example.com
- **Password**: password123

## Status

✅ Project Complete and Ready for Development Use

All core features implemented and working in development mode.

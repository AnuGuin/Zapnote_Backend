# Zapnote Backend

Zapnote Backend is a robust Node.js/TypeScript API server designed to power the Zapnote application, a collaborative knowledge management and AI-assisted platform. It provides RESTful endpoints for user management, workspace collaboration, AI-powered chat, knowledge base operations, search functionality, and whiteboard features.

## Features

- **User Management**: Authentication, user profiles, and access control
- **Workspace Collaboration**: Multi-user workspaces with role-based permissions
- **AI-Powered Chat**: Intelligent conversations with AI assistance
- **Knowledge Base**: Document and content management with embeddings
- **Advanced Search**: Vector-based search across knowledge and content
- **Whiteboard**: Collaborative drawing and diagramming tools
- **Real-time Communication**: WebSocket support for live updates
- **Queue Processing**: Background job processing for heavy tasks
- **Content Scraping**: Automated data extraction from various sources

## Architecture

The backend follows a modular architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Zapnote API   │    │  External APIs  │
│                 │◄──►│                 │◄──►│                 │
│ - Web Frontend  │    │ - Express Server│    │ - Gemini AI     │
│                 │    │ - REST Endpoints│    │ - Firebase Auth │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Middleware    │    │   Services      │    │   Database      │
│                 │    │                 │    │                 │
│ - Auth          │◄──►│ - AI Services   │◄──►│ - Prisma ORM    │
│ - Rate Limiting │    │ - Queue Service │    │ - PostgreSQL    │
│ - Validation    │    │ - Scraper       │    └─────────────────┘
└─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐
│   Cache & Queue │    │   File Storage  │
│                 │    │                 │
│ - Redis Cache   │    │ - Firebase      │
│ - QStash Queue  │    │ - Local Files   │
└─────────────────┘    └─────────────────┘
```

### Key Components

- **API Layer**: Express.js server handling HTTP requests and WebSocket connections
- **Business Logic**: Modular services for chat, knowledge, search, and more
- **Data Layer**: Prisma ORM with PostgreSQL database and Redis caching
- **AI Integration**: Gemini AI for embeddings, summarization, and chat
- **Authentication**: Firebase Authentication with custom middleware
- **Background Processing**: Queue system for async tasks like scraping and AI processing

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: Firebase Auth
- **AI**: Google Gemini
- **Queue**: QStash
- **WebSockets**: Socket.io
- **Scraping**: Custom scrapers for Twitter, YouTube, and generic sites

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Redis server
- Firebase project with authentication enabled
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zapnote-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/zapnote
   REDIS_URL=redis://localhost:6379
   FIREBASE_PROJECT_ID=your-project-id
   GEMINI_API_KEY=your-gemini-key
   QSTASH_TOKEN=your-qstash-token
   FRONTEND_URL=http://localhost:3000
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`.

## API Endpoints

### Core Routes

- `GET /health` - Health check endpoint
- `POST /api/test/seed` - Seed test data (development only)

### Module Routes

- `/api/v1/users/*` - User management
- `/api/v1/workspaces/*` - Workspace operations
- `/api/v1/workspaces/:workspaceId/chat/*` - Chat functionality
- `/api/v1/workspaces/:workspaceId/search/*` - Search operations
- `/api/v1/workspaces/:workspaceId/spaces/*` - Whiteboard features
- `/api/v1/knowledge/*` - Knowledge base management

## Development

### Project Structure

```
src/
├── app.ts              # Main Express app
├── server.ts           # Server startup
├── config/             # Configuration files
├── middleware/         # Express middleware
├── modules/            # Feature modules
│   ├── chat/
│   ├── knowledge/
│   ├── search/
│   ├── user/
│   ├── whiteboard/
│   └── workspace/
├── services/           # Shared services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

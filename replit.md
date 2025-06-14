# UCare AI - Medical Symptom Analysis Platform

## Overview

UCare AI is a full-stack web application designed to help people in rural areas understand their symptoms through AI-powered analysis. The platform accepts symptom descriptions via text, photos, or voice recordings, and provides medical insights using OpenAI's GPT-4o model. The application features a mobile-first design with a clean, accessible interface.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React-based SPA with TypeScript, Vite bundling, and Tailwind CSS styling
- **Backend**: Express.js API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **AI Integration**: OpenAI GPT-4o for symptom analysis and Whisper for audio transcription
- **Deployment**: Optimized for Replit's autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite with React plugin and runtime error overlay

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Uploads**: Multer middleware for handling image and audio files
- **AI Services**: OpenAI integration for symptom analysis and audio transcription
- **Storage**: Abstracted storage interface with in-memory implementation (can be extended to database)

### Database Schema
- **Users**: Basic user authentication table
- **Symptom Submissions**: Stores user submissions (text, photo, or voice)
- **Symptom Analyses**: Stores AI-generated analysis results with urgency levels and health recommendations

### Key Features
- **Multi-modal Input**: Support for text descriptions, photo uploads, and voice recordings
- **Real-time Speech Recognition**: Browser-based speech-to-text for voice input
- **AI-powered Analysis**: Comprehensive symptom analysis with urgency assessment
- **Mobile-first Design**: Responsive interface optimized for mobile devices
- **Session-based Tracking**: Anonymous sessions for privacy-focused usage

## Data Flow

1. **User Input**: Users can submit symptoms via three modalities:
   - Text descriptions through a form
   - Photo uploads of medical conditions
   - Voice recordings with automatic transcription

2. **Processing Pipeline**:
   - Text submissions go directly to OpenAI for analysis
   - Images are converted to base64 and analyzed using GPT-4o vision capabilities
   - Audio files are transcribed using OpenAI Whisper, then analyzed

3. **Analysis Generation**: OpenAI GPT-4o processes the input and returns:
   - Detailed symptom analysis
   - Urgency level (low/medium/high)
   - Possible causes
   - Health tips and recommendations
   - Emergency care indicators

4. **Result Storage**: Both submissions and analyses are stored in the database with session tracking

5. **User Interface**: Results are displayed in a structured format with appropriate urgency indicators

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **openai**: Official OpenAI API client
- **multer**: File upload handling middleware
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI/UX Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **esbuild**: Fast bundler for production builds

## Deployment Strategy

The application is configured for Replit's autoscale deployment:

- **Development**: Uses Vite dev server with HMR and TypeScript compilation
- **Build Process**: 
  - Client builds to `dist/public` using Vite
  - Server bundles to `dist/index.js` using esbuild
- **Production**: Serves static files and API from Express server
- **Database**: Expects PostgreSQL connection via `DATABASE_URL` environment variable
- **Port Configuration**: Listens on port 5000, exposed as port 80 externally

The deployment includes:
- Automatic database schema pushing via `drizzle-kit push`
- Environment-specific configurations
- Optimized bundling for production
- Session management and error handling

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
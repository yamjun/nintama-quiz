# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "忍たま太郎クイズ" (Nintama Taro Quiz) - a Japanese quiz web application about the anime "忍たま乱太郎" (Nintama Rantaro). The app is a client-side JavaScript application with Supabase integration for user authentication and score persistence.

## Architecture

### Core Structure
- **Frontend**: Vanilla HTML/CSS/JavaScript (no build process required)
- **Backend**: Supabase for authentication and data storage
- **Deployment**: Static files that can be served directly

### Key Files
- `index.html` - Main application structure with quiz interface, auth modals, and ranking display
- `script.js` - Core application logic including game state, authentication, and Supabase integration
- `quiz-data.js` - Question database (152 questions about Nintama Rantaro)
- `supabase-config.js` - Supabase client configuration and database schema
- `style.css` - Complete styling for the application

### Data Flow
1. **Game State**: Managed in `script.js` with global variables for current quiz, user session, and progress
2. **Authentication**: Supabase Auth with email/password, falls back to guest mode if unconfigured
3. **Score Storage**: Primary storage in Supabase `quiz_scores` table, fallback to localStorage
4. **Quiz Logic**: Random selection of 3 questions from 152-question database

## Supabase Integration

### Database Schema
The application expects a `quiz_scores` table:
```sql
CREATE TABLE quiz_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  player_name TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completion_time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Configuration
- Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `supabase-config.js`
- The app gracefully degrades to localStorage if Supabase is unconfigured

## Development Workflow

### Local Development
- Serve files from any static server (e.g., `python -m http.server` or VS Code Live Server)
- No build process required - all files are served directly

### Testing
- Manual testing through browser - no automated test framework
- Test both authenticated and guest modes
- Verify ranking display and score persistence

### GitHub Actions
- Configured with Claude PR Assistant that responds to `@claude` mentions
- Located in `.github/workflows/claude.yml`

## Key Features

### Quiz Functionality
- Random selection of 3 questions per session
- Multiple choice format with visual feedback
- Progress tracking and completion time measurement
- Score persistence with ranking system

### Authentication
- Email/password registration and login via Supabase Auth
- Guest mode fallback for demo purposes
- User session persistence across page reloads

### Responsive Design
- Mobile-first CSS with Japanese font support
- Modal dialogs for authentication
- Tab-based navigation between quiz and ranking
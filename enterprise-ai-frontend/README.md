# Northstar — Enterprise AI Knowledge Workspace (frontend prototype)

A Next.js frontend prototype for the Week 1 foundation of an Enterprise AI Knowledge & Workflow Assistant.

## What's included
- Dashboard overview with sample metrics and recent activity
- Document library with search and delete interactions
- Upload modal accepting PDF, DOCX and TXT files (demo only; file contents are not sent to a backend)
- AI Assistant preview with suggested prompts and demo responses
- Placeholder pages for Agent Workflows, Activity and Settings
- Responsive desktop/tablet/mobile layout

## Important prototype limitations
This is a frontend-only prototype. It does **not** yet include real authentication, PostgreSQL, FastAPI, persistent uploads, document parsing, RAG, or agent execution. The document list is held in React state and resets on refresh. Do not upload confidential documents to this prototype.

## Run locally on macOS
Requirements: Node.js 20.9 or newer.

```bash
# 1. Extract this folder and open Terminal in it
cd enterprise-ai-frontend

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open http://localhost:3000 in Chrome or Safari. Stop the server with Ctrl+C.

## Production build check (still local)
```bash
npm run build
npm run start
```
Then open http://localhost:3000. This runs the optimized Next.js build on your own Mac; it is not a cloud deployment.

## Next integration step
Create a FastAPI backend on http://localhost:8000 and replace the demo upload/list actions with API calls. Keep the frontend on :3000 and backend on :8000 during local development. Configure CORS in FastAPI for `http://localhost:3000`.

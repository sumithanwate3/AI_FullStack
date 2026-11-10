# Northstar — Enterprise AI Knowledge & Workflow Assistant

## 1. Project overview

Northstar is an enterprise knowledge workspace designed to help employees and administrators organize company documents, find information, and eventually delegate knowledge-based tasks to AI agents.

The long-term product vision is to combine:

- A centralized document repository.
- Retrieval-Augmented Generation (RAG) for grounded question answering.
- Document comparison and report generation.
- Agentic workflows for multi-step tasks.
- Monitoring and evaluation so the quality and reliability of AI features can be measured.

This repository currently contains the **Week 1 frontend prototype**. It establishes the user interface and interaction patterns before the backend, database, authentication, document processing, RAG and agent orchestration are implemented.

## 2. Problem being addressed

Organizations store useful knowledge across PDFs, Word files, technical guides, policies and reports. Employees often have to locate files, search manually, compare versions and assemble information themselves.

Northstar aims to provide one workspace where users can manage those documents and, in later milestones, ask questions in natural language and automate work using AI.

## 3. Intended users

### Administrator

An administrator will manage the organization's knowledge workspace. Planned capabilities include uploading and organizing documents, viewing document metadata, deleting or replacing files, and managing access.

### Employee

An employee will use the knowledge base to find information, ask questions about company documents, compare policies and request reports. These AI-powered capabilities are part of the future product scope and are not connected in this prototype yet.

## 4. Main product use cases

1. **Document management:** Upload, browse, search and remove organizational documents.
2. **Document question answering:** Ask questions and receive answers grounded in retrieved document passages, with source citations.
3. **Document comparison:** Compare two or more documents or versions and summarize their differences.
4. **Research and report generation:** Gather information across documents and create structured reports.
5. **Agentic workflow execution:** Use a supervisor and specialist agents to plan and carry out multi-step tasks, with approval for consequential actions.
6. **Enterprise knowledge search:** Search across the knowledge base using semantic, keyword and hybrid retrieval.

These use cases describe the intended direction of the complete product. Only the basic frontend interactions described below are currently implemented.

## 5. Current frontend prototype

The application is built with Next.js, React and TypeScript. The main interface is branded **Northstar** and contains these sections:

### Overview dashboard

- Displays sample workspace metrics.
- Shows recent documents and recent activity.
- Provides an entry point to upload documents and open the AI Assistant.

### Document library

- Displays a list of sample documents.
- Supports searching by document name or category.
- Provides a delete interaction that removes an item from the current in-memory list.
- Opens the upload dialog.

### Document upload dialog

- Supports selecting files or dragging and dropping them into the dialog.
- Accepts files with `.pdf`, `.docx` and `.txt` extensions.
- Displays basic file information in the document list.
- This is a demo interaction only: file contents are not uploaded to an API or persisted to disk by the application.

### AI Assistant preview

- Shows suggested questions.
- Allows a user to enter a question and see a placeholder response explaining that backend/RAG integration is pending.
- Does not call an LLM or retrieve information from documents.

### Agent Workflows, Activity and Settings

These sections are placeholders that communicate planned product areas. They do not currently execute workflows, provide a persistent audit log or save workspace settings.

## 6. Technology stack in this repository

| Technology | Role |
|---|---|
| Next.js 15 | React framework and local development server |
| React 19 | Component-based user interface |
| TypeScript | Static typing for frontend code |
| Lucide React | Interface icons |
| CSS | Layout, visual styling and responsive behavior |
| npm | Dependency installation and project scripts |

The current frontend does not include a backend framework or database dependency.

## 7. Codebase structure

```text
enterprise-ai-frontend/
├── app/
│   ├── page.tsx       # Main page, UI sections, state and demo interactions
│   ├── layout.tsx     # Root Next.js layout and page metadata
│   └── globals.css    # Global styles, layout, colors and responsive rules
├── public/            # Static assets (if added)
├── package.json       # Dependencies and npm scripts
├── tsconfig.json      # TypeScript configuration
├── next.config.ts     # Next.js configuration
├── next-env.d.ts      # Next.js TypeScript declarations
├── .gitignore         # Files excluded from Git
├── README.md          # Setup and run instructions
└── Description.md     # Product scope and technical description
```

### Important files

- **`app/page.tsx`:** Start here when studying the application. It contains the main page component, navigation state, sample document data, search filtering, upload-dialog behavior, demo chat behavior and reusable UI components.
- **`app/globals.css`:** Contains the styling for the dashboard, navigation, cards, tables, upload dialog, chat preview and responsive layouts.
- **`app/layout.tsx`:** Defines the root HTML layout and metadata shared by the application.
- **`package.json`:** Defines dependencies and commands such as `npm run dev` and `npm run build`.

## 8. Current data behavior and limitations

This is a frontend-only prototype, not a production application.

- The document list is initialized with sample records in `app/page.tsx`.
- React component state holds documents added or removed during the current browser session.
- Refreshing the page resets the list to the original sample data.
- Selecting a file only adds its name and basic metadata to the demo list; the file is not transmitted to a backend or stored persistently.
- The displayed dashboard metrics and activity entries are sample/demo content.
- The AI Assistant returns a placeholder response; it does not call an LLM.
- There is no real user registration, login, session management or role-based authorization.
- There is no FastAPI service, PostgreSQL database, object storage, document parsing, embedding generation, vector database, RAG pipeline, MCP server or agent execution connected yet.

**Do not use this prototype to upload confidential, personal or company-sensitive documents.**

## 9. Target architecture for future milestones

The planned local development architecture is:

```text
Browser
  |
  | Next.js frontend (http://localhost:3000)
  v
FastAPI backend (http://localhost:8000)
  |
  +---- Authentication and authorization
  |
  +---- Document upload and ingestion
  |       |
  |       +---- Local file storage initially
  |       +---- Parsing and metadata extraction
  |       +---- Chunking and preprocessing
  |       +---- Embedding generation
  |
  +---- PostgreSQL (users, document metadata, conversations)
  |
  +---- Vector database (document embeddings)
  |
  +---- Retrieval and RAG services
  |
  +---- LangGraph agents and MCP tools
```

The architecture is a target design, not a description of services already present in this repository. During early development, the frontend and backend can run as separate processes on the same Mac. PostgreSQL can also run locally.

## 10. Planned development milestones

### Week 1 — Frontend and backend foundation

- Establish the Next.js frontend and FastAPI backend.
- Define API contracts between them.
- Implement document upload endpoints.
- Set up PostgreSQL and SQLAlchemy models.
- Implement basic registration and login securely.
- Connect the document library to backend APIs.

### Week 2 — Document ingestion

- Validate uploaded file types and sizes on the server.
- Store original files.
- Parse PDF, DOCX and TXT content.
- Extract useful metadata such as page number and section heading where available.
- Prepare a document processing pipeline.

### Week 3 — Embeddings and basic RAG

- Split documents into meaningful chunks.
- Generate embeddings.
- Store vectors in a vector database.
- Retrieve relevant chunks for a user query.
- Generate grounded answers with source references.

### Week 4 — Advanced retrieval

- Add keyword and hybrid retrieval.
- Experiment with reranking and query rewriting.
- Evaluate retrieval quality against a test question set.

### Week 5 — Agentic capabilities

- Introduce LangGraph orchestration.
- Build specialist agents and a supervisor workflow.
- Expose selected operations through MCP tools.
- Add structured inputs and outputs.

### Week 6 — Reliability and access control

- Add workflow state persistence, retries and error handling.
- Add human approval before consequential actions.
- Enforce document-level authorization.
- Record useful audit events.

### Week 7 — Local packaging and deployment preparation

- Containerize services with Docker.
- Add environment-based configuration and secret handling.
- Add automated checks and tests through CI.
- Prepare a cloud deployment configuration if needed.

### Week 8 — Evaluation and observability

- Trace LLM and agent executions.
- Measure retrieval quality, faithfulness, latency, token use and tool success rate.
- Document benchmarks, limitations and design decisions.
- Prepare a demonstrable end-to-end product walkthrough.

The schedule is a proposed roadmap; scope and timing may change as implementation progresses.

## 11. Run the frontend locally on macOS

### Requirements

- macOS
- Node.js 20.9 or newer (use an active LTS release where possible)
- npm
- VS Code or another code editor

### Setup

From the project directory, run:

```bash
npm install
npm run dev
```

Open the local development URL:

```text
http://localhost:3000
```

Stop the development server with `Control + C` in the terminal where it is running.

### Create a production build locally

To check whether Next.js can create an optimized build without deploying to a cloud server:

```bash
npm run build
npm run start
```

Then open `http://localhost:3000`. This is still running on your own machine; it is not a public deployment.

## 12. Engineering principles for the project

- Keep frontend, backend and AI orchestration responsibilities separated.
- Validate files and user inputs on the backend, not only in the browser.
- Never commit API keys, passwords or other secrets to Git.
- Enforce authentication and document-level authorization on every protected API.
- Preserve source metadata so AI answers can cite their evidence.
- Evaluate retrieval and agent behavior rather than relying on a few successful demos.
- Make consequential tool actions require explicit authorization or human approval.
- Document trade-offs, limitations and measured results honestly.

## 13. Definition of the first milestone being complete

Week 1 should be considered complete when a user can register and log in, upload a supported document through the frontend, have the backend validate and store it, see its metadata in the document library after a page refresh, and delete it through an authenticated API. PostgreSQL should persist user and document metadata. The AI Assistant and Agent Workflows can remain clearly marked as upcoming features at this stage.

---

**Project status:** Frontend prototype created; backend, database integration, authentication and AI capabilities are planned work.

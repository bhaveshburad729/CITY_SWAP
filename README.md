# 🌆 CITY_SWAP - Full-Stack Intercity Exchange Platform

A modern full-stack web application enabling travelers, expats, and locals to exchange items, gear, and short-term accommodations across cities globally. Built with a modular React frontend and a FastAPI (Python) backend adhering strictly to enterprise architecture standards.

---

## 📌 Project Overview

- **Project Name**: CITY_SWAP
- **Frontend Architecture**: React 18+ (Vite) + Axios + Custom CSS Design System
- **Backend Architecture**: Python 3.10+ (FastAPI + Pydantic + Uvicorn)
- **Environment Management**: Isolated Python Virtual Environment (`myenv`) & `.env` configurations

---

## 🚀 Features

- **Intercity Item Listing**: Discover items offered in one city (e.g., New York) and desired in another (e.g., London).
- **Interactive Post Modal**: Create new swap listings seamlessly with client-side & server-side validation.
- **Live Search & Category Filtering**: Filter swap opportunities by categories (Transportation, Housing, Electronics, etc.) and search terms.
- **Backend Health Check & Failover**: Real-time status indicator showing backend connection state with fallback handling.
- **FastAPI Interactive Docs**: Built-in Swagger UI documentation at `http://127.0.0.1:8000/docs`.

---

## 🛠️ Tech Stack & Justifications

### Frontend Stack (`client/`)
| Package / Tool | Purpose & Justification |
| :--- | :--- |
| **React (Vite)** | Fast development server, modular component architecture, and lightning-fast HMR build. |
| **Axios** | Promised-based HTTP client for seamless API communication, error handling, and base URL config. |
| **React Router DOM** | Declarative client-side routing for multi-page navigation (`/`, `/login`, `/signup`, `/dashboard`). |
| **Framer Motion** | Physics-based fluid animations, tab slider indicators, glassmorphic entrance transitions, and micro-interactions. |
| **ThreePortalLogins** | Side-by-side composite component rendering all 3 portal login cards (Citizen, Driver, Collector) matching reference specs. |
| **CitizenPortalLogin** | Dedicated login component with mobile number + OTP authentication, Google SSO, and WhatsApp AI Assistant support. |
| **DriverPortalLogin** | Dedicated login component with Employee ID + password authentication, route duty management, and support helpline. |
| **CollectorPortalLogin** | Dedicated login component with Employee ID + password authentication, field operations management, and support helpline. |
| **React Hook Form** | High-performance, un-opinionated form state management with easy validation integration. |
| **Zod** | TypeScript-first schema validation for email, password strength, and input rules. |
| **@hookform/resolvers** | Seamless bridge connecting Zod validation schemas with React Hook Form. |
| **Lucide Icons** | Clean modern vector icons for UI enhancement. |
| **Leaflet & React-Leaflet** | Interactive OpenStreetMap rendering, real-time driver GPS tracking, route polyline visualization, and geotagged waste report markers. |
| **agentation** | In-browser visual annotation toolbar enabling real-time feedback & MCP server sync with AI coding agents. |
| **Custom CSS Tokens** | Tailored glassmorphism, responsive CSS grid, dark mode, and sleek micro-animations. |

### Backend Stack (`server/`)
| Package / Tool | Purpose & Justification |
| :--- | :--- |
| **FastAPI** | High-performance Python web framework with auto-generated OpenAPI / Swagger docs. |
| **Uvicorn** | Lightning-fast ASGI web server implementation. |
| **SQLAlchemy** | SQL Toolkit & Object Relational Mapper (ORM) for PostgreSQL/SQLite database persistence. |
| **Passlib [bcrypt]** | Secure password hashing algorithm for user credentials. |
| **Python-Jose** | Cryptographic token creation and verification for JWT access tokens. |
| **Python-Multipart** | Parser for handling image and media file uploads via HTTP multipart forms. |
| **Pydantic** | Data validation, type safety, and automatic response serialization. |
| **Python Dotenv** | Secure parsing of `.env` configuration parameters without hardcoding secrets. |

---

## 📁 Directory Structure & Explanation

```
CITY_SWAP/
├── client/                     # All Frontend React code
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # CSS & image assets
│   │   ├── components/         # Reusable UI components (Navbar, ItemCard, Modal, Footer)
│   │   ├── hooks/              # Custom React hooks (useSwapItems.js)
│   │   ├── pages/              # Main view pages (HomePage.jsx)
│   │   ├── services/           # Axios API service (api.js)
│   │   ├── App.jsx             # Top-level React app component
│   │   ├── main.jsx            # React root mount entry point
│   │   └── index.css           # Global design system & theme CSS
│   └── package.json            # Frontend dependency manifest
│
├── server/                     # All Backend Python code
│   ├── database/               # Database connections & data stores (db.py)
│   ├── models/                 # Data models & business objects (item.py)
│   ├── schemas/                # Pydantic validation schemas (item.py)
│   ├── routes/                 # Modular API endpoints (health.py, item.py)
│   ├── services/               # Business logic layer (item_service.py)
│   ├── utils/                  # Config & helper utilities (config.py)
│   ├── main.py                 # FastAPI app entry point & CORS configuration
│   └── .env                    # Local environment variables
│
├── myenv/                      # Python virtual environment (isolated packages)
├── .gitignore                  # Git exclusion rules (myenv, node_modules, .env, etc.)
├── requirements.txt            # Backend Python dependencies
└── README.md                   # Complete project documentation
```

### Why This Architecture?
- **Separation of Concerns**: Frontend UI logic (`client/`) is strictly separated from backend business logic (`server/`).
- **Layered Backend**: Routes handle HTTP protocols, Services manage business logic, Models define domain structures, and Schemas enforce type validation.
- **Isolated Environment**: Dependencies are kept inside `myenv/` to avoid polluting global Python installations.

---

## ⚡ Getting Started & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)

### 2. Backend Setup (`server/`)
Activate the virtual environment and start the Uvicorn server:

#### Windows (PowerShell):
```powershell
# Activate virtual environment
.\myenv\Scripts\activate

# Install requirements (if modifying)
pip install -r requirements.txt

# Run backend development server
python -m server.main
# OR
uvicorn server.main:app --reload --port 8000
```

The backend server will run at: `http://127.0.0.1:8000`  
FastAPI Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup (`client/`)
In a new terminal window:

```bash
cd client

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```

The React frontend application will run at: `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
PROJECT_NAME="CITY_SWAP API"
VERSION="1.0.0"
ENV="development"
PORT=8000
SECRET_KEY="your_jwt_secret_key_change_in_prod"
```

> [!WARNING]
> **Security Notice**: Never commit `.env` files containing real production secrets, API keys, or database credentials to version control.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root greeting and health documentation links |
| `GET` | `/api/health` | Service health status & system timestamp |
| `GET` | `/api/items` | Fetch all active city swap listings |
| `GET` | `/api/items/{id}` | Fetch specific swap item details by ID |
| `POST` | `/api/items` | Create a new swap item listing |
| `POST` | `/api/auth/login` | Authenticate user credentials & issue session token |
| `POST` | `/api/auth/signup` | Register new user account with role selection |

---

## 🛡️ Security Best Practices Implemented

1. **CORS Configuration**: Restricts cross-origin requests to trusted frontend domains (`http://localhost:5173`).
2. **Data Validation**: Request payloads are rigorously sanitized and validated using Pydantic schemas.
3. **Environment Security**: Sensitive keys are loaded from `.env` via `python-dotenv`.
4. **Git Safety**: Secrets, build output, `node_modules/`, and `myenv/` are explicitly ignored in `.gitignore`.

---

## 🔮 Future Scope & Enhancements

- **Database Integration**: Connect SQLAlchemy / PostgreSQL for persistent relational storage.
- **Authentication**: Implement JWT token authentication and user login routes.
- **Direct Messaging**: Add real-time chat between swappers using WebSockets.
- **Image Uploads**: Integrate cloud media storage (AWS S3 or Cloudinary) for item photos.

---

## 🤖 Agentation MCP Server Integration

The **Agentation MCP Server** is completely configured and enabled for real-time visual feedback and automated AI code edits:

- **Frontend Component**: `<Agentation />` toolbar is integrated in [`client/src/App.jsx`](file:///c:/Users/Hi/Desktop/CITY_SWAP/client/src/App.jsx) (active in development mode).
- **MCP Server Protocol**: Exposes tools (`agentation_list_sessions`, `agentation_get_pending`, `agentation_watch_annotations`, `agentation_reply`, `agentation_resolve`, `agentation_dismiss`) for direct agent communication.
- **Workflow**:
  1. Open the application in development (`npm run dev`).
  2. Use the in-browser Agentation toolbar to annotate or leave visual feedback on UI components.
  3. The AI agent listens via `agentation_watch_annotations`, inspects CSS selectors and DOM contexts, applies code fixes, and marks annotations resolved via `agentation_resolve`.
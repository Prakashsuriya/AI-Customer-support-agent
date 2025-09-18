# AI Customer Support Agent

This is a full-stack AI-powered customer support chat application. It authenticates users, allows them to chat with an AI assistant, and stores the chat history.

## Features

- **Authentication**: JWT-based authentication (Signup, Login, Logout).
- **Chat System**: Real-time chat with an AI, with conversation history saved per user.
- **Chat History:** Stores conversation history in a MongoDB database.
- **Rate Limiting:** Protects the API from abuse with `express-rate-limit`.
- **AI Integration**: Connected to the Google Gemini API for intelligent responses.
- **Dockerized**: The entire application is containerized for easy setup and deployment.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **AI Service**: Google Gemini

## Project Structure

```
/ai-customer-support-agent
|-- /client         # React frontend
|-- /server         # Node.js backend
|-- docker-compose.yml
|-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker and Docker Compose
- A MongoDB Atlas account (or a local MongoDB instance)
- A Google Gemini API key from Google AI Studio

### Local Setup

1.  **Clone the repository**

2.  **Configure Backend**
    - Navigate to the `server` directory.
    - Create a `.env` file and add the following variables:
      ```
      PORT=5003
      MONGO_URI=<your_mongodb_uri>
      GEMINI_API_KEY=<your_gemini_api_key>
      JWT_SECRET=<your_jwt_secret>
      ```
    - Install dependencies and run the server:
      ```bash
      npm install
      npm start
      ```

3.  **Configure Frontend**
    - Navigate to the `client` directory.
    - Install dependencies and run the client:
      ```bash
      npm install
      npm run dev
      ```

### Docker Setup

1.  **Configure Environment**
    - Ensure you have a `.env` file in the `server` directory as described above.

2.  **Run with Docker Compose**
    - From the root directory, run:
      ```bash
      docker-compose up --build
      ```
    - The application will be available at `http://localhost`.

## API Endpoints

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Log in a user.
- `POST /api/chat/send`: Send a message to the AI.
- `GET /api/chat/history`: Retrieve the user's chat history.

# AI Customer Support Agent

A sophisticated, full-stack AI-powered customer support chat application with a modern UI and robust backend. This application provides an intelligent chat interface that can handle customer inquiries with the help of Google's Gemini AI, featuring user authentication, conversation history, and a responsive design.

## ✨ Features

- **Modern UI/UX**: Built with Material-UI and Framer Motion for smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Real-time Chat**: Interactive chat interface with AI responses
- **User Authentication**: Secure JWT-based authentication system
- **Conversation History**: Persists chat history for logged-in users
- **Rate Limiting**: Protects against API abuse
- **Multi-language Support**: Ready for internationalization (i18n)
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Built with TypeScript for better code quality

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Internationalization**: i18next, react-i18next
- **Styling**: Emotion (CSS-in-JS)
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **AI Integration**: Google Gemini API
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston/Morgan

### Development Tools
- **Linting**: ESLint, Prettier
- **Version Control**: Git
- **Containerization**: Docker, Docker Compose
- **Package Manager**: npm

## Project Structure

```
/ai-customer-support-agent
|-- /client         # React frontend
|-- /server         # Node.js backend
|-- docker-compose.yml
|-- README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm 8+
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prakashsuriya/AI-Customer-support-agent.git
   cd AI-Customer-support-agent
   ```

2. **Backend Setup**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev  # Development mode with hot-reload
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   cp .env.example .env
   # Update VITE_API_URL if needed
   npm install
   npm run dev
   ```

4. **Environment Variables**

   **Backend (server/.env)**
   ```env
   PORT=5004
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key
   ```

   **Frontend (client/.env)**
   ```env
   VITE_API_URL=http://localhost:5004
   ```

### 🐳 Docker Setup

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```
   - Backend: `http://localhost:5004`
   - Frontend: `http://localhost:5174`

2. **Development with Docker**
   ```bash
   # Run in development mode with hot-reload
   docker-compose -f docker-compose.dev.yml up --build
   ```

### 🌐 Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your deployed backend URL

#### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables from `server/.env`

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user and get JWT token

### Chat
- `POST /api/chat/send` - Send a message to the AI
- `GET /api/chat/history` - Get user's chat history

### Example Request (Send Message)
```http
POST /api/chat/send
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "message": "Hello, how can you help me?"
}
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd ../client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - For the powerful AI capabilities
- [Material-UI](https://mui.com/) - For the beautiful React components
- [Vite](https://vitejs.dev/) - For the fast development experience
- [Framer Motion](https://www.framer.com/motion/) - For smooth animations

## API Endpoints

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Log in a user.
- `POST /api/chat/send`: Send a message to the AI.
- `GET /api/chat/history`: Retrieve the user's chat history.

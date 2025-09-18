const Message = require('../models/Message');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Rate limiting setup
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // Increased from 10 to 30 requests per minute per user

// In-memory store for conversation context
const conversationContext = new Map();

// Fallback responses for common queries
const FALLBACK_RESPONSES = {
  'top rated movie': 'The current top-rated movie on IMDb is "The Shawshank Redemption" (1994) with a rating of 9.3/10. For the most current box office hits, I recommend checking the latest charts on IMDb or Rotten Tomatoes.',
  'latest movie': 'The latest blockbuster movies include "Dune: Part Two" and "Oppenheimer". For real-time box office information, you can visit websites like Box Office Mojo or IMDb.',
  'ai trends': {
    response: 'Some of the latest AI trends include:\n1. Generative AI and large language models\n2. AI-powered automation\n3. AI in healthcare\n4. Ethical AI and regulations\n5. AI-powered cybersecurity\n\nWould you like more details on any of these trends?',
    followUps: {
      '1': 'Generative AI and large language models (like GPT-4) are transforming how we create and interact with content. They can generate human-like text, translate languages, write code, and more. These models are being integrated into various applications, from customer service to content creation.',
      'generative ai': 'Generative AI and large language models (like GPT-4) are transforming how we create and interact with content. They can generate human-like text, translate languages, write code, and more. These models are being integrated into various applications, from customer service to content creation.',
      '2': 'AI-powered automation is revolutionizing industries by handling repetitive tasks with high accuracy and speed. Key applications include:\n\n1. **Robotic Process Automation (RPA)**: Automating rule-based tasks in business processes.\n2. **Intelligent Document Processing**: Extracting and processing information from documents.\n3. **Customer Service**: Chatbots and virtual assistants handling routine inquiries.\n4. **Manufacturing**: Predictive maintenance and quality control.\n5. **Supply Chain**: Optimizing logistics and inventory management.',
      'ai-powered automation': 'AI-powered automation is revolutionizing industries by handling repetitive tasks with high accuracy and speed. Key applications include:\n\n1. **Robotic Process Automation (RPA)**: Automating rule-based tasks in business processes.\n2. **Intelligent Document Processing**: Extracting and processing information from documents.\n3. **Customer Service**: Chatbots and virtual assistants handling routine inquiries.\n4. **Manufacturing**: Predictive maintenance and quality control.\n5. **Supply Chain**: Optimizing logistics and inventory management.',
      '3': 'AI in healthcare is transforming patient care and medical research:\n\n1. **Diagnosis**: AI can analyze medical images and patient data to assist in diagnosis.\n2. **Drug Discovery**: Accelerating the development of new medications.\n3. **Personalized Medicine**: Tailoring treatments to individual patients.\n4. **Wearables**: Monitoring patient health in real-time.\n5. **Administrative Tasks**: Automating scheduling and documentation.',
      'ai in healthcare': 'AI in healthcare is transforming patient care and medical research:\n\n1. **Diagnosis**: AI can analyze medical images and patient data to assist in diagnosis.\n2. **Drug Discovery**: Accelerating the development of new medications.\n3. **Personalized Medicine**: Tailoring treatments to individual patients.\n4. **Wearables**: Monitoring patient health in real-time.\n5. **Administrative Tasks**: Automating scheduling and documentation.',
      '4': 'Ethical AI and regulations are becoming increasingly important as AI becomes more prevalent:\n\n1. **Bias and Fairness**: Ensuring AI systems don\'t discriminate.\n2. **Transparency**: Making AI decision-making processes understandable.\n3. **Privacy**: Protecting user data and ensuring compliance with regulations like GDPR.\n4. **Accountability**: Determining responsibility for AI decisions.\n5. **Regulations**: Governments worldwide are developing frameworks to govern AI use.',
      'ethical ai': 'Ethical AI and regulations are becoming increasingly important as AI becomes more prevalent:\n\n1. **Bias and Fairness**: Ensuring AI systems don\'t discriminate.\n2. **Transparency**: Making AI decision-making processes understandable.\n3. **Privacy**: Protecting user data and ensuring compliance with regulations like GDPR.\n4. **Accountability**: Determining responsibility for AI decisions.\n5. **Regulations**: Governments worldwide are developing frameworks to govern AI use.',
      '5': 'AI-powered cybersecurity is essential for defending against increasingly sophisticated threats:\n\n1. **Threat Detection**: Identifying potential security breaches in real-time.\n2. **Anomaly Detection**: Spotting unusual behavior that might indicate an attack.\n3. **Automated Response**: Quickly containing and mitigating threats.\n4. **Phishing Prevention**: Detecting and blocking phishing attempts.\n5. **Vulnerability Management**: Identifying and patching security weaknesses.',
      'ai-powered cybersecurity': 'AI-powered cybersecurity is essential for defending against increasingly sophisticated threats:\n\n1. **Threat Detection**: Identifying potential security breaches in real-time.\n2. **Anomaly Detection**: Spotting unusual behavior that might indicate an attack.\n3. **Automated Response**: Quickly containing and mitigating threats.\n4. **Phishing Prevention**: Detecting and blocking phishing attempts.\n5. **Vulnerability Management**: Identifying and patching security weaknesses.'
    }
  },
  'ai-powered cybersecurity': 'AI-powered cybersecurity is transforming how we protect digital assets. Key aspects include:\n\n1. **Threat Detection**: AI analyzes patterns to identify potential threats in real-time.\n2. **Anomaly Detection**: Machine learning identifies unusual behavior that might indicate a security breach.\n3. **Automated Response**: AI can automatically respond to certain types of cyber threats.\n4. **Phishing Detection**: AI helps identify and block phishing attempts.\n5. **Vulnerability Management**: AI can predict and patch vulnerabilities before they are exploited.\n\nWould you like more details on any specific aspect?',
  'generative ai': 'Generative AI is a type of artificial intelligence that can create new content, such as:\n\n1. **Text Generation**: Creating human-like text (like ChatGPT)\n2. **Image Generation**: Creating realistic images from text descriptions (like DALL-E, Midjourney)\n3. **Code Generation**: Writing and debugging code (like GitHub Copilot)\n4. **Music and Audio**: Composing music or generating voiceovers\n5. **Video Generation**: Creating or editing videos based on prompts\n\nThese models are trained on large datasets and can generate highly realistic outputs across various domains.',
  'help': {
    response: 'I can help you with various topics including:\n1. Latest movies and TV shows\n2. Technology trends\n3. General knowledge questions\n4. Current events\n5. And much more!\n\nWhat would you like to know about?',
    followUps: {
      '1': 'For the latest movies and TV shows, you can ask me about:\n- Current box office hits\n- Top-rated movies\n- Upcoming releases\n- Popular TV series\n- Or ask for recommendations!',
      'movies': 'For the latest movies and TV shows, you can ask me about:\n- Current box office hits\n- Top-rated movies\n- Upcoming releases\n- Popular TV series\n- Or ask for recommendations!',
      '2': 'For technology trends, you can ask about:\n- Latest AI developments\n- New gadgets and devices\n- Programming and software\n- Tech industry news\n- Future technology predictions',
      'technology': 'For technology trends, you can ask about:\n- Latest AI developments\n- New gadgets and devices\n- Programming and software\n- Tech industry news\n- Future technology predictions',
      '3': 'For general knowledge, you can ask about:\n- Historical events\n- Science and nature\n- Geography and cultures\n- Arts and literature\n- Or test me with trivia questions!',
      'general knowledge': 'For general knowledge, you can ask about:\n- Historical events\n- Science and nature\n- Geography and cultures\n- Arts and literature\n- Or test me with trivia questions!',
      '4': 'For current events, you can ask about:\n- World news\n- Business and finance\n- Science and technology\n- Sports updates\n- Or any recent developments you\'re curious about',
      'current events': 'For current events, you can ask about:\n- World news\n- Business and finance\n- Science and technology\n- Sports updates\n- Or any recent developments you\'re curious about',
      '5': 'I can also help with:\n- Answering questions\n- Explaining concepts\n- Providing recommendations\n- Offering advice (non-professional)\n- And much more!\n\nFeel free to ask me anything!',
      'what else': 'I can also help with:\n- Answering questions\n- Explaining concepts\n- Providing recommendations\n- Offering advice (non-professional)\n- And much more!\n\nFeel free to ask me anything!'
    }
  },
  'hello': 'Hello! I\'m your AI assistant. How can I help you today?',
  'hi': 'Hi there! What would you like to know?',
  'thank you': 'You\'re welcome! Is there anything else I can help you with?',
  'bye': 'Goodbye! Feel free to come back if you have more questions.'
};

// Function to find the best matching fallback response
function getFallbackResponse(message, userId) {
  if (!message || typeof message !== 'string') {
    return "I'm not sure how to respond to that. Could you try asking in a different way?";
  }
  
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for follow-up questions first
  const context = conversationContext.get(userId);
  if (context && context.lastResponse && context.lastResponse.followUps) {
    // Check for number selection (e.g., "1" for first item)
    if (/^\d+$/.test(lowerMessage.trim()) && parseInt(lowerMessage) <= Object.keys(context.lastResponse.followUps).length) {
      return {
        response: context.lastResponse.followUps[lowerMessage.trim()],
        isFollowUp: true
      };
    }
    
    // Check for keyword matches in follow-ups
    for (const [key, response] of Object.entries(context.lastResponse.followUps)) {
      if (lowerMessage.includes(key)) {
        return {
          response,
          isFollowUp: true
        };
      }
    }
  }

  // Check for exact matches in main responses
  for (const [key, responseObj] of Object.entries(FALLBACK_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      // Store the context for follow-up questions
      if (responseObj.followUps) {
        conversationContext.set(userId, {
          lastResponse: responseObj,
          timestamp: Date.now()
        });
      }
      return {
        response: responseObj.response || responseObj,
        isFollowUp: false
      };
    }
  }
  
  // Check for partial matches
  const commonQueries = {
    'movie': 'For the latest movie information, I recommend checking IMDb or Rotten Tomatoes.',
    'weather': 'I can\'t check real-time weather, but you can check your local weather service or a weather app for the most accurate forecast.',
    'news': 'For the latest news, I recommend checking reputable news websites like BBC, CNN, or Reuters.',
    'time': `The current time is ${new Date().toLocaleTimeString()}.`,
    'date': `Today's date is ${new Date().toLocaleDateString()}.`,
    'how are you': 'I\'m just a computer program, but I\'m functioning well! How can I assist you today?'
  };
  
  for (const [key, response] of Object.entries(commonQueries)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Default fallback responses
  const defaultResponses = [
    `I'm currently helping several users, so I might be a bit slow. Could you try rephrasing your question or ask me again in a moment?`,
    `I'm having trouble finding that information right now. Could you try being more specific or ask me again in a moment?`,
    `I'm still learning! Could you try a different question? I'm better with specific, clear questions.`,
    `I'm not sure about that one. Is there something else I can help you with? I'm great with general knowledge, current events, and more!`,
    `I'm experiencing high traffic right now. For the most current information, you might want to check online resources. What else can I help you with?`
  ];
  
  // If no matches, return a generic response
  return {
    response: "I'm not quite sure I understand. Could you try asking in a different way? I'm here to help!",
    isFollowUp: false
  };
}

const sendMessage = async (req, res) => {
  try {
    // Validate request
    if (!req.body || !req.body.message) {
      console.error('No message provided in request body');
      return res.status(400).json({ 
        message: 'Message is required',
        isError: true
      });
    }

    const { message } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ 
        message: 'User not authenticated',
        isError: true
      });
    }

    console.log(`[${new Date().toISOString()}] Received message from user ${userId}: "${message}"`);

    // Rate limiting check
    const now = Date.now();
    const userRequests = rateLimit.get(userId) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000);
      return res.status(429).json({
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        isError: true,
        retryAfter
      });
    }

    // Update rate limit
    recentRequests.push(now);
    rateLimit.set(userId, recentRequests);

    // Save user message to database
    const userMessage = new Message({
      user: userId,
      content: message,
      sender: 'user',
    });
    await userMessage.save();

    // Check if we should use a fallback response (only for very short messages)
    const lowerMessage = message.toLowerCase().trim();
    const shouldUseFallback = 
      // Only use fallback for very short messages (greetings, thanks, etc.)
      lowerMessage.split(/\s+/).length <= 3 ||
      // Or if we're in development mode without an API key
      (process.env.NODE_ENV !== 'production' && !process.env.GEMINI_API_KEY);

    if (shouldUseFallback) {
      console.log(`[${new Date().toISOString()}] Using fallback response for short message`);
      const fallbackResult = getFallbackResponse(message, userId);
      const response = fallbackResult.response || fallbackResult;
      
      const aiMessage = new Message({
        user: userId,
        content: response,
        sender: 'ai',
        isFallback: true,
        isFollowUp: fallbackResult.isFollowUp || false
      });
      
      await aiMessage.save();
      return res.json(aiMessage);
    }

    // Try to use Gemini API for the response
    try {
      console.log(`[${new Date().toISOString()}] Sending message to Gemini...`);
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      // Get conversation history for context
      const conversationHistory = await Message.find({
        user: userId,
        createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
      })
      .sort({ createdAt: 1 })
      .limit(10); // Last 10 messages

      // Format the conversation history
      const history = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add the current message
      history.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const aiMessageContent = response.text();
      
      console.log(`[${new Date().toISOString()}] Successfully received response from Gemini`);
      
      // Save AI response to database
      const aiMessage = new Message({
        user: userId,
        content: aiMessageContent,
        sender: 'ai',
      });
      
      await aiMessage.save();
      return res.json(aiMessage);
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // If we hit an error, try to get a fallback response
      const fallbackResult = getFallbackResponse(message, userId);
      let errorMessage = fallbackResult.response || fallbackResult;
      
      // Add more specific error messages based on the error type
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = `I'm currently helping many users right now. ${errorMessage}`;
      } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
        errorMessage = `I'm taking longer than expected to respond. ${errorMessage}`;
      } else {
        errorMessage = `I encountered an error: ${error.message}. ${errorMessage}`;
      }
      
      const fallbackMessage = new Message({
        user: userId,
        content: errorMessage,
        sender: 'ai',
        isFallback: true,
        isError: true
      });
      
      await fallbackMessage.save();
      return res.json(fallbackMessage);
    }
    
  } catch (error) {
    console.error('Unexpected error in sendMessage:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred. Please try again.',
      isError: true
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        isError: true 
      });
    }
    
    const messages = await Message.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(50); // Limit to most recent 50 messages
      
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      message: 'Error fetching chat history',
      isError: true 
    });
  }
};

module.exports = { sendMessage, getChatHistory };
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([]); // Store messages
  const [userInput, setUserInput] = useState(''); // User input state
  const [loading, setLoading] = useState(false); // Loading state
  const [userId, setUserId] = useState(''); // Persistent user ID
  const chatContainerRef = useRef(null); // Reference for auto-scrolling

  // Generate a new user ID each time the page refreshes
  useEffect(() => {
    const newUserId = String(Math.floor(1000 + Math.random() * 9000)); // Generate a random 4-digit user ID
    setUserId(newUserId); // Update state with the new user ID
  }, []);

  // Function to handle user input
  const handleUserInput = async () => {
    if (userInput.trim() === '') return; // Prevent empty messages

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post('http://13.49.68.219:5001/query', {
        message: userInput,
        user_id: userId, // Use the current user ID
      });

      console.log('API Response:', response.data);
      const botResponse = response.data.response || response.data;

      // Create bot message
      let botMessage;

      // Function to detect and highlight URLs
      const highlightLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
          if (index % 2 === 1) {
            // It's a URL, make it clickable
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {part}
              </a>
            );
          }
          return part; // Return non-URL text as is
        });
      };

      if (Array.isArray(botResponse)) {
        botMessage = {
          sender: 'bot',
          text: 'Here are some related questions you might find helpful:',
          options: botResponse,
        }; 
      } else {
        botMessage = {
          sender: 'bot',
          text: highlightLinks(botResponse), // Highlight links in the response
        };
      }

      // Append bot message
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'There was an error. Please try again later.' },
      ]);
    }

    setLoading(false);
    setUserInput('');
  };

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 flex flex-col items-center p-4">
      <motion.img
        src="./logo.png"
        alt="Logo"
        className="w-24 h-12 sm:w-32 sm:h-18 mb-4 drop-shadow-lg"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      />

      {/* Chat container */}
      <div className="w-full h-[400px] max-w-md bg-white rounded-xl shadow-lg flex flex-col">
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-sm text-gray-700">{message.text}</div>
              {message.options && (
                <ul className="mt-2 space-y-2">
                  {message.options.map((option, idx) => (
                    <li key={idx} className="text-blue-500 underline cursor-pointer">
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="p-3 text-center text-blue-500 italic">Bot is typing...</div>
        )}

        {/* Input section */}
        <div className="flex p-3 border-t border-gray-200">
          <motion.input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleUserInput();
              }
            }}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <motion.button
            onClick={handleUserInput}
            className={`p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default App;

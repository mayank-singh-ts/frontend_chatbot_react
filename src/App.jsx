import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([]); // Store messages
  const [userInput, setUserInput] = useState(''); // User input state
  const [loading, setLoading] = useState(false); // Loading state
  const chatContainerRef = useRef(null); // Reference for auto-scrolling

  // Function to handle user input
  const handleUserInput = async () => {
    if (userInput.trim() === '') return; // Prevent empty messages

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post('http://13.49.68.219:5001/query', {
        message: userInput,
        user_id: '123',
      });
      console.log('API Response:', response.data);

      // Handle response format for multiple questions
      const botResponse = response.data.response || response.data;
      let botMessage;

      if (Array.isArray(botResponse)) {
        // If the response is an array of questions
        botMessage = {
          sender: 'bot',
          text: 'Here are some related questions you might find helpful:',
          options: botResponse,
        };
      } else {
        // If the response is a plain string
        botMessage = { sender: 'bot', text: botResponse };
      }

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
                message.sender === 'user'
                  ? 'bg-blue-100 self-end'
                  : 'bg-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-sm text-gray-700">
                {message.text}
                {message.options && (
                  <ul className="mt-2 space-y-2">
                    {message.options.map((option, idx) => (
                      <li key={idx} className="text-blue-500 underline cursor-pointer">
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
            className={`p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
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

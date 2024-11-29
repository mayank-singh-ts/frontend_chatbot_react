import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import framer-motion

function App() {
  const [messages, setMessages] = useState([]); // Store messages in state
  const [userInput, setUserInput] = useState(''); // User input state
  const [loading, setLoading] = useState(false); // Loading state for request

  // Function to handle user input
  const handleUserInput = async () => {
    if (userInput.trim() === '') return;

    const newMessage = {
      sender: 'user',
      text: userInput,
    };
    setMessages([...messages, newMessage]); // Add user's message to the chat

    setLoading(true); // Show loading indicator

    try {
      // Send user input to backend (Flask API)
      const response = await axios.post('http://127.0.0.1:5001/query', {
        message: userInput,
        user_id: 'user1', // Use a fixed user ID for simplicity
      });

      // Add bot's response to the chat
      const botMessage = {
        sender: 'bot',
        text: response.data.response || 'I am sorry, I did not understand that.',
      };

      setMessages([...messages, newMessage, botMessage]);
      setLoading(false); // Hide loading indicator

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'There was an error with the service. Please try again later.',
      };
      setMessages([...messages, newMessage, errorMessage]);
      setLoading(false);
    }

    setUserInput(''); // Clear user input field after submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 flex flex-col items-center p-4">
      {/* Company Logo */}
      <motion.img
        src={"./logo.png"} // Replace with your logo
        alt="Company Logo"
        className="w-24 h-12 sm:w-32 sm:h-18 mb-4 drop-shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      />

      <div className="w-full h-[400px] max-w-md bg-white rounded-xl shadow-lg flex flex-col">
        {/* Chat Messages */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg max-w-full break-words ${
                  message.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100'
                }`}
              >
                <div className="text-sm text-gray-700">{message.text}</div>
              </motion.div>
            ))
          )}
        </div>

        {/* Loading indicator */}
        {loading && <div className="p-3 text-center text-blue-500 italic">Bot is typing...</div>}

        {/* Input Section */}
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
            placeholder="Ask something..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading} // Disable input during loading
          />
          <motion.button
            onClick={handleUserInput}
            className={`p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            whileHover={{ scale: !loading ? 1.1 : 1.0 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading} // Disable button during loading
          >
            {loading ? 'Sending...' : 'Send'}
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-white mt-3 opacity-75">
        Powered by Tamar Software © 2024
      </p>
    </div>
  );
}

export default App;

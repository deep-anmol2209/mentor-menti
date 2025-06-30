import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiMessageSquare, FiUser, FiMenu } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import chatApi from "../apiManager/chat"

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm EduBot, your virtual assistant. How can I help you with mentorship today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);


    const response = await chatApi.sendChat(inputMessage)
    console.log(response);
    const botMessage = {
      id: messages.length + 2,
      text: response.data.data,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          } bg-teal-600 hover:bg-teal-700 text-white`}
        aria-label="Open chat"
      >
        <FiMessageSquare size={24} />
      </button>

      {/* Chat Container */}
      {/* <div
        className={`fixed bottom-8 right-8  z-50 flex flex-col w-full  max-w-md h-[70vh] bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{
          maxHeight: 'calc(100vh - 120px)',
        }}
      > */}
      <div
        className={`fixed z-50 flex flex-col w-[95%] sm:w-full max-w-md h-[70vh] bg-white rounded-lg shadow-xl transition-all duration-300 transform 
    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'} 
    bottom-4 right-1 sm:bottom-8 sm:right-8 mx-auto sm:mx-0`}
        style={{
          maxHeight: 'calc(100vh - 80px)', // safer for mobile
        }}
      >

        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-teal-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <BsRobot size={24} />
            <h3 className="text-lg font-semibold">EduHub Assistant</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-teal-700 transition-colors"
            aria-label="Close chat"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${message.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <FiUser className="mr-2" />
                    ) : (
                      <BsRobot className="mr-2" />
                    )}
                    <span className="text-xs opacity-80">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm md:text-base">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex mb-4 justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg rounded-tl-none p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-2 sm:p-4 border-t border-gray-200 bg-white">
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-grow px-1 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
    <button
      type="submit"
      className="shrink-0 px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors"
      disabled={!inputMessage.trim()}
    >
      <FiSend size={20} />
    </button>
  </div>
</form>


      </div>
    </>
  );
};

export default Chat;
import React, { useState, useRef, useEffect } from 'react';
import { generateCreativeResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'SYSTEM ONLINE. Initializing creative matrix. How may I assist?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await generateCreativeResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-black text-white p-4 shadow-xl hover:bg-gray-800 transition-all border border-transparent"
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[450px] bg-white/90 border border-[#E5E5E5] backdrop-blur-xl flex flex-col h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="bg-[#FAFAFA] p-4 flex justify-between items-center border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <span className="font-mono text-sm tracking-widest text-[#333]">AI_ORACLE</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black hover:text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed border ${
                    msg.role === 'user' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-gray-200 shadow-sm'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-black/50 text-xs font-mono animate-pulse">
                    <Cpu size={14} />
                    <span>PROCESSING...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#E5E5E5] flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT COMMAND..."
                className="flex-1 bg-[#FAFAFA] border border-[#E5E5E5] p-3 text-black text-sm font-mono focus:outline-none focus:border-black transition-colors placeholder-gray-400"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white px-4 hover:bg-gray-800 transition-colors disabled:opacity-50 font-bold"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
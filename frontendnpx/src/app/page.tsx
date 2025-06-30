'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        question: input,
      });

      const botMessage = {
        role: 'bot',
        content: res.data.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Something went wrong. Please try again later.' },
      ]);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Evren AI Chatbot 🤖</h1>

        <div className="h-[400px] overflow-y-auto bg-gray-50 p-4 rounded border mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm max-w-[75%] ${
                msg.role === 'user'
                  ? 'ml-auto bg-blue-100 text-right'
                  : 'mr-auto bg-green-100 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Evren AI..."
            className="flex-1 p-2 border rounded-l focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

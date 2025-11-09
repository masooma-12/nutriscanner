import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello sweetheart! How can I help you with your meals today? 🌸" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const currentHistory = [...messages, newUserMessage].filter(m => m.role !== 'model' || m.content !== "Hello sweetheart! How can I help you with your meals today? 🌸");

        try {
            const stream = await import('../services/geminiService').then(m => m.getMealSuggestionStream(currentHistory, currentInput));
            let newModelMessage = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                newModelMessage += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model') {
                        newMessages[newMessages.length - 1].content = newModelMessage;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev.slice(0, -1), { role: 'model', content: "Oh dear, something went wrong. Please try again. 💖" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col" style={{height: 'calc(100vh - 7rem)'}}>
            <h2 className="text-3xl font-bold text-pink-500 mb-4 text-center">Chat with Luvable AI 💬</h2>
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-lg">🌸</div>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-pink-500 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none'}`}>
                            {msg.content === '' ? '...' : msg.content}
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="mt-auto flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask for a meal suggestion..."
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-pink-300 focus:outline-none transition-shadow"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-pink-500 text-white p-3 rounded-r-lg font-semibold hover:bg-pink-600 disabled:bg-pink-300 transition-colors">
                    {isLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatView;

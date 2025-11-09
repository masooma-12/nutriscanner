import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { MicrophoneIcon, SpeakerOnIcon, SpeakerOffIcon } from '../components/IconComponents';

// FIX: Define a minimal interface for SpeechRecognition to fix TypeScript errors
// in environments where the Web Speech API types are not available.
interface SpeechRecognition {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    abort: () => void;
    stop: () => void;
    start: () => void;
}

// Gracefully handle browser differences for SpeechRecognition
// FIX: Cast window to `any` to access experimental properties and rename `SpeechRecognition` constant to `SpeechRecognitionAPI` to avoid shadowing the native `SpeechRecognition` type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;
if (SpeechRecognitionAPI) {
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello sweetheart! How can I help you with your meals today? 🌸" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
    const lastSpokenMessageIndex = useRef<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(recognition);

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
        } catch (e: any) {
            console.error(e);
            const errorMessage = e.message || "Oh dear, something went wrong. Please try again. 💖";
            setMessages(prev => {
                if (prev.length > 0 && prev[prev.length - 1].content === '' && prev[prev.length-1].role === 'model') {
                     return [...prev.slice(0, -1), { role: 'model', content: errorMessage }];
                }
                return [...prev, { role: 'model', content: errorMessage }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Voice Input Logic ---
    useEffect(() => {
        const rec = recognitionRef.current;
        if (!rec) return;

        rec.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        rec.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };
        rec.onend = () => {
            setIsListening(false);
        };
        
        return () => {
            rec.abort();
        };
    }, []);

    const handleToggleListening = () => {
        if (!recognitionRef.current) {
            alert("So sorry, your browser doesn't support voice input! 🌸");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput('');
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    // --- Text-to-Speech Logic ---
    useEffect(() => {
        if (!isLoading && isSpeechEnabled && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const lastMessageIndex = messages.length - 1;

            if (lastMessage.role === 'model' && lastMessage.content && lastSpokenMessageIndex.current !== lastMessageIndex) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(lastMessage.content);
                
                const setVoice = () => {
                    const voices = speechSynthesis.getVoices();
                    utterance.voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
                };

                if (speechSynthesis.getVoices().length > 0) {
                    setVoice();
                } else {
                    speechSynthesis.onvoiceschanged = setVoice;
                }
                
                utterance.pitch = 1.1;
                utterance.rate = 1;
                speechSynthesis.speak(utterance);
                lastSpokenMessageIndex.current = lastMessageIndex;
            }
        }
    }, [messages, isLoading, isSpeechEnabled]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);


    return (
        <div className="p-4 h-full flex flex-col" style={{height: 'calc(100vh - 7rem)'}}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-pink-500">Chat with Luvable</h2>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className="p-2 rounded-full hover:bg-pink-100 transition-colors" aria-label={isSpeechEnabled ? "Disable Read Aloud" : "Enable Read Aloud"}>
                    {isSpeechEnabled ? <SpeakerOnIcon className="w-6 h-6 text-pink-500" /> : <SpeakerOffIcon className="w-6 h-6 text-gray-400" />}
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-lg self-start">🌸</div>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-pink-500 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none'}`}>
                            {msg.content === '' && isLoading ? 'Typing...' : msg.content}
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask for a meal suggestion..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:outline-none transition-shadow"
                    disabled={isLoading}
                />
                <button onClick={handleToggleListening} disabled={!recognitionRef.current || isLoading} className={`p-3 text-white rounded-lg transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'} disabled:bg-pink-300`}>
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-pink-500 text-white p-3 rounded-lg font-semibold hover:bg-pink-600 disabled:bg-pink-300 transition-colors">
                    {isLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatView;
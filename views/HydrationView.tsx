import React, { useState } from 'react';
import { WaterDropIcon } from '../components/IconComponents';

const HydrationView: React.FC = () => {
    const [glasses, setGlasses] = useState(0);
    const goal = 8;
    const progress = Math.min((glasses / goal) * 100, 100);

    const motivationalMessage = () => {
        if (glasses === 0) return "Let's start hydrating for a great day! 💧";
        if (glasses < goal / 2) return "You're on your way! Keep sipping. ✨";
        if (glasses >= goal / 2 && glasses < goal) return `Great! You’re halfway to today’s goal 💧✨`;
        if (glasses >= goal) return "Amazing job! You've reached your hydration goal! 💖";
        return "Keep up the fantastic work! 🌸";
    };

    return (
        <div className="p-4 text-center">
            <h2 className="text-3xl font-bold text-pink-500 mb-2">Hydration Tracker</h2>
            <p className="text-gray-600 mb-6 min-h-[40px]">{motivationalMessage()}</p>
            
            <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-pink-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                    <path className="text-pink-400 transition-all duration-500"
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <WaterDropIcon className="w-10 h-10 text-blue-400 animate-pulse" />
                    <span className="text-3xl font-bold text-gray-700">{glasses}</span>
                    <span className="text-gray-500">/ {goal} glasses</span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-4">
                <button onClick={() => setGlasses(g => Math.max(0, g - 1))} className="w-16 h-16 bg-white text-3xl font-bold text-pink-500 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 active:scale-95">-</button>
                <button onClick={() => setGlasses(g => g + 1)} className="w-20 h-20 bg-pink-500 text-4xl font-bold text-white rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 active:scale-95">+</button>
                <button onClick={() => setGlasses(0)} className="w-16 h-16 bg-white text-base font-bold text-gray-500 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 active:scale-95">Reset</button>
            </div>
        </div>
    );
};

export default HydrationView;

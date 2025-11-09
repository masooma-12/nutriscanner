import React, { useState, useEffect, useRef } from 'react';
import { WaterDropIcon, BellIcon, BellOffIcon } from '../components/IconComponents';

const HydrationView: React.FC = () => {
    const [glasses, setGlasses] = useState(0);
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const reminderIntervalRef = useRef<number | null>(null);
    const goal = 8;
    const progress = Math.min((glasses / goal) * 100, 100);

    // Effect to initialize state from localStorage and clean up interval
    useEffect(() => {
        if (!('Notification' in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        const storedPreference = localStorage.getItem('hydrationRemindersEnabled');
        if (storedPreference === 'true' && Notification.permission === 'granted') {
            setRemindersEnabled(true);
        }

        return () => {
            if (reminderIntervalRef.current) {
                clearInterval(reminderIntervalRef.current);
            }
        };
    }, []);
    
    // Effect to manage the interval when remindersEnabled changes
    useEffect(() => {
        if (remindersEnabled) {
            // Clear any existing interval before setting a new one
            if (reminderIntervalRef.current) {
                clearInterval(reminderIntervalRef.current);
            }
            const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
            reminderIntervalRef.current = window.setInterval(() => {
                new Notification('Time for a water break! 💧', {
                    body: "Luvable reminds you to stay hydrated and happy! 💖",
                    icon: '/vite.svg', 
                });
            }, TWO_HOURS_IN_MS);
        } else {
            if (reminderIntervalRef.current) {
                clearInterval(reminderIntervalRef.current);
                reminderIntervalRef.current = null;
            }
        }
    }, [remindersEnabled]);


    const handleToggleReminders = async () => {
        if (!('Notification' in window)) {
            alert("So sorry, your browser doesn't support reminders! 🌸");
            return;
        }

        if (remindersEnabled) {
            // Explicitly clear the interval right away when disabling
            if (reminderIntervalRef.current) {
                clearInterval(reminderIntervalRef.current);
                reminderIntervalRef.current = null;
            }
            setRemindersEnabled(false);
            localStorage.setItem('hydrationRemindersEnabled', 'false');
        } else {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setRemindersEnabled(true);
                localStorage.setItem('hydrationRemindersEnabled', 'true');
                new Notification('Hydration Reminders On! ✨', {
                    body: "Great choice! I'll gently remind you to drink water every 2 hours. 🌸",
                });
            } else {
                alert("It's okay! I won't be able to send you reminders without permission. 💖");
            }
        }
    };
    
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
            
            <div className="mt-10">
                <button 
                    onClick={handleToggleReminders} 
                    className={`flex items-center justify-center gap-2 w-full max-w-xs mx-auto font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 ${remindersEnabled ? 'bg-green-100 text-green-800' : 'bg-white text-gray-700'}`}
                >
                    {remindersEnabled ? <BellOffIcon className="w-5 h-5" /> : <BellIcon className="w-5 h-5" />}
                    {remindersEnabled ? 'Disable Reminders' : 'Stop Reminders'}
                </button>
            </div>
        </div>
    );
};

export default HydrationView;
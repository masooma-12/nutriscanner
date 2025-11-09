import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { CameraIcon, SparklesIcon } from '../components/IconComponents';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

interface ScanViewProps {
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const ScanView: React.FC<ScanViewProps> = ({ setAnalysisResult, setIsLoading, setError }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const processImage = async (image: File | Blob) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        if (isCameraOn) stopCamera();

        try {
            const base64Image = await toBase64(image as File);
            const result = await import('../services/geminiService').then(m => m.analyzeFoodLabel(base64Image));
            setAnalysisResult(result);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await processImage(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraOn(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access the camera. Please check permissions. 🌸");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if(blob) processImage(blob);
            }, 'image/jpeg');
        }
    };
    
    useEffect(() => {
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <style>{`.animate-gradient-pan { background-size: 200%; animation: background-pan 3s linear infinite; }`}</style>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 text-transparent bg-clip-text animate-gradient-pan mb-2">
                NutriScan
            </h1>
            <p className="text-gray-600 text-lg mt-2 mb-8">
                Hello beautiful! Let's discover the goodness in your food. 💖
            </p>

            <div className="w-full max-w-md aspect-video bg-rose-50/50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-pink-200 relative shadow-inner">
                <video ref={videoRef} className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`} playsInline />
                {!isCameraOn && (
                     <div className="absolute text-center text-gray-500 p-6">
                        <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-pink-300" />
                        <h3 className="font-semibold text-lg text-gray-600">Ready to Scan?</h3>
                        <p>Point your camera at a food label to begin!</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-md">
                 {isCameraOn ? (
                     <button onClick={capturePhoto} className="w-24 h-24 flex items-center justify-center bg-pink-500 text-white rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95 animate-pulse-luv">
                        <CameraIcon className="w-10 h-10" />
                    </button>
                ) : (
                     <button onClick={startCamera} className="w-full flex items-center justify-center gap-3 bg-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 animate-pulse-luv">
                        <CameraIcon className="w-7 h-7" /> Use Camera
                    </button>
                )}
                
                {!isCameraOn && (
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="text-pink-500 font-semibold hover:underline transition-colors"
                    >
                        or upload a photo
                    </button>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            </div>
        </div>
    );
};

export default ScanView;
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { CameraIcon, UploadIcon } from '../components/IconComponents';

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
    isLoading: boolean;
}

const ScanView: React.FC<ScanViewProps> = ({ setAnalysisResult, setIsLoading, setError, isLoading }) => {
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
            <h1 className="text-4xl font-bold text-pink-500">NutriScan</h1>
            <p className="text-gray-600 mt-2 mb-6">Scan a food packet to check what’s really inside 💡</p>
            
            <div className="w-full max-w-md aspect-video bg-gray-200/50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative">
                <video ref={videoRef} className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`} playsInline />
                {!isCameraOn && (
                     <div className="absolute text-center text-gray-500">
                        <CameraIcon className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                        <p>Your camera view will appear here</p>
                    </div>
                )}
            </div>

            {isLoading && (
                 <div className="mt-6 flex items-center space-x-2 text-pink-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <span>Analyzing with Luvable... 💖</span>
                </div>
            )}
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-white text-pink-500 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-pink-50 transition-transform transform hover:scale-105 active:scale-95">
                    <UploadIcon className="w-6 h-6" /> Upload Label
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                
                {isCameraOn ? (
                     <button onClick={capturePhoto} className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-pink-600 transition-transform transform hover:scale-105 active:scale-95">
                        <CameraIcon className="w-6 h-6" /> Capture
                    </button>
                ) : (
                     <button onClick={startCamera} className="w-full flex items-center justify-center gap-2 bg-white text-pink-500 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-pink-50 transition-transform transform hover:scale-105 active:scale-95">
                        <CameraIcon className="w-6 h-6" /> Use Camera
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScanView;

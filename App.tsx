import React, { useState, useCallback } from 'react';
import { AppView, AnalysisResult } from './types';
import BottomNavBar from './components/BottomNavBar';
import AnimatedBackground from './components/AnimatedBackground';
import ScanView from './views/ScanView';
import ResultsView from './views/ResultsView';
import ChatView from './views/ChatView';
import HydrationView from './views/HydrationView';
import DashboardView from './views/DashboardView';

const Loader: React.FC = () => (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
        <p className="text-pink-500 text-lg font-semibold mt-4">Analyzing with Luvable... 💖</p>
    </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(AppView.SCAN);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetScan = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const renderContent = () => {
    // This key prop is crucial. It tells React to create a new component instance
    // when the view changes, which re-triggers our fadeIn animation.
    const animationKey = analysisResult ? 'results' : activeView;

    return (
      <div key={animationKey} className="view-fade-in">
        {(() => {
          switch (activeView) {
            case AppView.SCAN:
              return analysisResult ? (
                <ResultsView result={analysisResult} onReset={resetScan} />
              ) : (
                <ScanView 
                  setAnalysisResult={setAnalysisResult} 
                  setIsLoading={setIsLoading} 
                  setError={setError} 
                />
              );
            case AppView.CHAT:
              return <ChatView />;
            case AppView.HYDRATION:
              return <HydrationView />;
            case AppView.DASHBOARD:
              return <DashboardView />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="font-sans min-h-screen text-gray-800 relative">
      <AnimatedBackground />
      {isLoading && <Loader />}
      <main className="pt-8 pb-24 max-w-4xl mx-auto px-4">
        {error && (
            <div className="m-4 p-4 bg-red-100 border-l-4 border-red-400 text-red-700 rounded-lg text-center" role="alert">
                <p>{error}</p>
                <button onClick={() => setError(null)} className="font-bold underline mt-2">Dismiss</button>
            </div>
        )}
        {renderContent()}
      </main>
      <BottomNavBar activeView={activeView} setActiveView={(view) => {
        if (view !== activeView) {
            resetScan();
            setActiveView(view);
        }
      }} />
    </div>
  );
}
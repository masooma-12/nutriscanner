import React, { useMemo } from 'react';
import { AnalysisResult } from '../types';
import AnalysisGraph from '../components/AnalysisGraph';
import { CheckCircleIcon } from '../components/IconComponents';

interface ResultsViewProps {
    result: AnalysisResult;
    onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
    const counts = useMemo(() => {
        let good = 0;
        let moderate = 0;
        let high = 0;
        result.nutrients.forEach(n => {
            if (n.score === 'good') good++;
            else if (n.score === 'moderate') moderate++;
            else if (n.score === 'high') high++;
        });
        return { good, moderate, high };
    }, [result]);

    return (
        <div className="p-4">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-pink-500 mb-1">{result.productName}</h2>
                {result.fssaiVerified && (
                    <div className="flex items-center justify-center gap-2 text-green-600 animate-pulse">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">Verified with FSSAI Data</span>
                    </div>
                )}
            </div>

            <div className="max-w-md mx-auto space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center">
                    <p className="text-lg text-gray-700 italic">"{result.summary}"</p>
                </div>
                
                <AnalysisGraph good={counts.good} moderate={counts.moderate} high={counts.high} />
                
                {result.allergens.length > 0 && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <h3 className="font-bold text-red-800">⚠️ Potential Allergens</h3>
                        <p className="text-red-700">{result.allergens.join(', ')}</p>
                    </div>
                )}
                
                <button onClick={onReset} className="w-full bg-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-pink-600 transition-transform transform hover:scale-105 active:scale-95">
                    Scan Another Item
                </button>
            </div>
        </div>
    );
};

export default ResultsView;

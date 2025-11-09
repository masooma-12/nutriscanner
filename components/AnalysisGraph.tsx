import React from 'react';

interface AnalysisGraphProps {
  good: number;
  moderate: number;
  high: number;
}

const Bar: React.FC<{
  label: string;
  value: number;
  percent: number;
  colorClass: string;
  delay: string;
}> = ({ label, value, percent, colorClass, delay }) => (
  <div className="flex items-center space-x-3">
    <span className="font-semibold text-gray-600 w-24 text-right">{label}</span>
    <div className="flex-1 bg-gray-200/70 rounded-full h-6 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${percent}%`, transitionDelay: delay }}
      ></div>
    </div>
    <span className="font-bold text-gray-800 w-8 text-left">{value}</span>
  </div>
);

const AnalysisGraph: React.FC<AnalysisGraphProps> = ({ good, moderate, high }) => {
  const total = good + moderate + high;
  const goodPercent = total > 0 ? (good / total) * 100 : 0;
  const moderatePercent = total > 0 ? (moderate / total) * 100 : 0;
  const highPercent = total > 0 ? (high / total) * 100 : 0;

  return (
    <div className="space-y-4 p-4 bg-white/60 rounded-xl shadow-md backdrop-blur-sm">
      <h3 className="text-lg font-bold text-gray-800 text-center mb-4">Nutrient Balance</h3>
      <Bar label="Good" value={good} percent={goodPercent} colorClass="bg-green-400" delay="100ms" />
      <Bar label="Moderate" value={moderate} percent={moderatePercent} colorClass="bg-yellow-400" delay="200ms" />
      <Bar label="High Risk" value={high} percent={highPercent} colorClass="bg-red-400" delay="300ms" />
    </div>
  );
};

export default AnalysisGraph;

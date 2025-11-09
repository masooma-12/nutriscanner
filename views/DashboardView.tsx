import React from 'react';
import { WaterDropIcon, CheckCircleIcon, ChartPieIcon } from '../components/IconComponents';

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    comment: string;
    color: 'green' | 'purple' | 'yellow';
}> = ({ icon, title, value, comment, color }) => {
    const colorMap = {
        green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-800' },
        yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800' },
    };
    const colors = colorMap[color];

    return (
        <div className={`p-4 rounded-lg shadow-md border-l-4 text-left flex items-start space-x-4 transition-transform transform hover:scale-105 ${colors.bg} ${colors.border}`}>
            <div className={`p-2 rounded-full ${colors.text} bg-white`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-bold ${colors.text}`}>{title}</h3>
                <p className="text-gray-700 text-lg font-semibold">{value}</p>
                <p className="text-gray-600 text-sm">{comment}</p>
            </div>
        </div>
    );
};

const DashboardView: React.FC = () => {
    return (
        <div className="p-4 text-center">
            <h2 className="text-3xl font-bold text-pink-500 mb-6">Your Weekly Summary 🌸</h2>
            <div className="space-y-4 max-w-md mx-auto">
                <StatCard 
                    icon={<WaterDropIcon className="w-6 h-6" />}
                    title="Hydration Progress"
                    value="Improved by 12%"
                    comment="Proud of you for staying hydrated!"
                    color="green"
                />
                <StatCard 
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    title="Routine Completion"
                    value="5 out of 7 days"
                    comment="Amazing consistency with your 'Sunrise Routine'!"
                    color="purple"
                />
                <StatCard 
                    icon={<ChartPieIcon className="w-6 h-6" />}
                    title="Healthy Scans"
                    value="80% 'Good' Choices"
                    comment="Keep making those mindful choices!"
                    color="yellow"
                />
            </div>
        </div>
    );
};

export default DashboardView;

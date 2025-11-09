
import React from 'react';
import { AppView } from '../types';
import { ScanIcon, ChatIcon, WaterDropIcon, DashboardIcon } from './IconComponents';

interface BottomNavBarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-pink-500';
  const inactiveClasses = 'text-gray-400 hover:text-pink-400';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-300 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-t-lg flex justify-around items-center z-50">
      <NavItem
        icon={<ScanIcon className="w-6 h-6" />}
        label="Scan"
        isActive={activeView === AppView.SCAN}
        onClick={() => setActiveView(AppView.SCAN)}
      />
      <NavItem
        icon={<ChatIcon className="w-6 h-6" />}
        label="Chat"
        isActive={activeView === AppView.CHAT}
        onClick={() => setActiveView(AppView.CHAT)}
      />
      <NavItem
        icon={<WaterDropIcon className="w-6 h-6" />}
        label="Hydration"
        isActive={activeView === AppView.HYDRATION}
        onClick={() => setActiveView(AppView.HYDRATION)}
      />
      <NavItem
        icon={<DashboardIcon className="w-6 h-6" />}
        label="Dashboard"
        isActive={activeView === AppView.DASHBOARD}
        onClick={() => setActiveView(AppView.DASHBOARD)}
      />
    </div>
  );
};

export default BottomNavBar;


import React from 'react';

const AnimatedBackground: React.FC = () => {
    const icons = ['🌸', '💧', '✨', '💖', '🥗', '🍋', '🌿', '🥑', '🍌', '🍎'];

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
            {icons.map((icon, index) => {
                const style = {
                    left: `${Math.random() * 95}vw`,
                    top: `${Math.random() * 95}vh`,
                    animation: `float ${15 + Math.random() * 20}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${1.5 + Math.random()}rem`,
                    opacity: 0.1 + Math.random() * 0.1,
                };

                return (
                    <span key={index} className="absolute" style={style}>
                        {icon}
                    </span>
                );
            })}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) translateX(15px) rotate(180deg); }
                    100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;

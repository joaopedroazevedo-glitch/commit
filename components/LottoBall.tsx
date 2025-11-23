import React from 'react';

interface LottoBallProps {
    number: number;
}

export const LottoBall: React.FC<LottoBallProps> = ({ number }) => {
    return (
        <div 
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center font-bold text-3xl md:text-4xl shadow-lg transform transition-transform duration-300 hover:scale-110 bg-white border-8 border-gray-300"
        >
            <span className="text-gray-900 drop-shadow-md">{number}</span>
        </div>
    );
};
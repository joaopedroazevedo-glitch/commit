import React from 'react';

interface HistoryProps {
    numbers: number[];
}

export const History: React.FC<HistoryProps> = ({ numbers }) => {
    // Show last 10 numbers in reverse order of drawing (most recent first)
    const lastTenNumbers = numbers.slice(-10).reverse();

    if (lastTenNumbers.length === 0) {
        return null;
    }

    return (
        <div className="w-full text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-400 mb-3">Últimos Sorteados</h3>
            <div className="flex flex-wrap justify-center items-center gap-2 p-2 rounded-lg bg-black/20">
                {lastTenNumbers.map((num, index) => (
                    <div
                        key={`${num}-${index}`} // Use index in key to handle potential duplicates in history
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-inner flex-shrink-0 transition-all duration-300
                            ${index === 0 ? 'bg-amber-400 text-black scale-110' : 'bg-blue-700 text-white'}`}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

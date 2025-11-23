import React, { useState, useCallback, useRef } from 'react';
import { LottoBall } from './components/LottoBall';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Sparkles, Ticket } from 'lucide-react';
import { History } from './components/History';

const App: React.FC = () => {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
    const [drawHistory, setDrawHistory] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudioContext = () => {
        if (audioContextRef.current) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.", e);
        }
    };

    const playSound = (type: 'draw' | 'reset') => {
        if (!audioContextRef.current) return;
        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, context.currentTime + 0.01);

        if (type === 'draw') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, context.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.2);
        } else if (type === 'reset') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(400, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.3);
        }
    };

    const generateBingoNumber = useCallback(async () => {
        initAudioContext();
        setIsLoading(true);
        setError(null);
        setCurrentNumber(null);
        
        if (drawnNumbers.length >= 90) {
            setError("Bingo! Todos os números de 1 a 90 já foram sorteados.");
            setIsLoading(false);
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));

        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 90) + 1;
        } while (drawnNumbers.includes(randomNumber));

        setCurrentNumber(randomNumber);
        setDrawnNumbers(prev => [...prev, randomNumber].sort((a, b) => a - b));
        setDrawHistory(prev => [...prev, randomNumber]);
        playSound('draw');

        setIsLoading(false);
    }, [drawnNumbers]);

    const handleReset = () => {
        initAudioContext();
        playSound('reset');
        setCurrentNumber(null);
        setDrawnNumbers([]);
        setDrawHistory([]);
        setError(null);
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-blue-900 bg-gradient-to-t from-black/50 to-transparent text-white flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
            <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-800 via-blue-900 to-black rounded-2xl shadow-2xl shadow-red-500/10 border border-red-600/30 p-6 md:p-8 text-center">
                
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Ticket className="w-8 h-8 text-red-400" />
                    <h1 style={{ fontFamily: "'Cinzel', serif" }} className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-amber-500">
                        Bingo da Sorte
                    </h1>
                </div>

                <p className="text-gray-300 mb-8">
                    Clique para sortear o próximo número!
                </p>

                <div className="min-h-[180px] flex items-center justify-center p-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                           <LoadingSpinner />
                           <p className="text-red-400 animate-pulse">Sorteando número...</p>
                        </div>
                    ) : currentNumber ? (
                        <div className="animate-fade-in">
                            <LottoBall number={currentNumber} />
                        </div>
                    ) : (
                         <div className="text-gray-500">
                             Seu próximo número aparecerá aqui.
                         </div>
                    )}
                </div>
                
                <div className="min-h-[80px] flex items-center justify-center px-4 py-2">
                     {error && !isLoading && (
                        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg p-4 animate-fade-in">
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={generateBingoNumber}
                    disabled={isLoading}
                    className="mt-8 w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold tracking-wider py-3 px-6 rounded-lg shadow-lg shadow-red-900/40 border-2 border-yellow-400 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 btn-hover-glow"
                >
                   <Sparkles className="w-5 h-5" />
                   SORTEAR NÚMERO
                </button>

                {drawnNumbers.length > 0 && (
                    <div className="mt-8 w-full border-t-2 border-blue-700/50 pt-6 animate-fade-in">
                        <History numbers={drawHistory} />

                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-300 mb-4">Todos os Números ({drawnNumbers.length}/90)</h2>
                            <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto p-2 bg-black/20 rounded-lg custom-scrollbar">
                                {drawnNumbers.map(num => (
                                    <div key={num} className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-md flex-shrink-0 ${num === currentNumber ? 'animate-pop-in' : ''}`}>
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleReset} className="mt-6 text-sm text-yellow-400 hover:text-yellow-200 transition-colors">
                            Reiniciar Jogo
                        </button>
                    </div>
                )}
            </div>
            <footer className="text-center text-blue-500/80 mt-8 text-sm">
                Powered by React
            </footer>
        </div>
    );
};

export default App;

import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="w-12 h-12 border-4 border-t-4 border-blue-700/50 border-t-red-500 rounded-full animate-spin"></div>
    );
};
import React from "react";


export const AnimatedOrbs = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
            <div className="absolute top-10 left-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
    );
};
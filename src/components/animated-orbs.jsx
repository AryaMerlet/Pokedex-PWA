import React from "react";

export const AnimatedOrbs = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
            {/* Floating pixel blocks in Pokemon colors */}
            <div className="absolute top-10 left-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-pixel-red border-4 border-white opacity-80 animate-pixel-float-1"></div>
            <div className="absolute top-20 right-20 w-6 h-6 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-white border-4 border-foreground opacity-90 animate-pixel-float-2"></div>
            <div className="absolute bottom-20 left-1/4 w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-pixel-blue border-4 border-white opacity-80 animate-pixel-float-3"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-pixel-yellow border-4 border-foreground opacity-80 animate-pixel-float-1" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/4 right-10 w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-pixel-red border-4 border-white opacity-80 animate-pixel-float-2" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-10 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white border-2 border-foreground opacity-70 animate-pixel-float-3" style={{ animationDelay: '2s' }}></div>
        </div>
    );
};
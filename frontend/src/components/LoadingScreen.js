const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-[length:400%_400%] animate-gradientBlur"></div>
            
            <div className="absolute w-72 h-72 bg-purple-400 opacity-30 blur-3xl rounded-full top-1/4 left-1/4 animate-floatSlow"></div>
            <div className="absolute w-56 h-56 bg-blue-400 opacity-30 blur-3xl rounded-full bottom-1/4 right-1/3 animate-floatSlow"></div>
            <div className="absolute w-64 h-64 bg-indigo-400 opacity-30 blur-3xl rounded-full top-1/5 right-1/5 animate-floatSlow"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <h2 className="text-xl font-semibold text-gray-300">Loading...</h2>
            </div>
        </div>
    );
};

export default LoadingScreen;

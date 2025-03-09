import { Link } from "react-router-dom";
import { useState, useEffect} from "react";


const ClientPage = () => {

    useEffect(() => {
            document.body.style.overflow = 'hidden';
            
            return () => {
              document.body.style.overflow = 'auto';
            };
          }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-start text-white min-h-screen flex flex-col items-center justify-center space-y-8 p-4 z-0">
            <div 
                className="absolute inset-0 bg-gradient-to-r from-gradient-start via-gradient-middle via-gradient-middle-2 to-gradient-end bg-[length:200%_200%] animate-smooth z-0"
                style={{
                    backgroundSize: "200% 200%",
                    animation: "smoothGradient 15s linear infinite",
                    willChange: "background-position"
                }}
            ></div>

            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blue-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>
            <div className="absolute top-1/5 right-1/5 w-56 h-56 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-glow animate-floatSlow"></div>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
            Welcome to ReVolve
            </h1>
    
            <p className="text-2xl font-semibold text-gray-400">Please choose an option:</p>
    
            <div className="space-y-4">
                <Link
                    to="/login"
                    className="block bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-center text-white text-3xl font-semibold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transform transition-all"
                >
                    Login
                </Link>
        
                <Link
                    to="/register"
                    className="block bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-center text-white text-3xl font-semibold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transform transition-all"
                >
                    Register
                </Link>
            </div>  
        </div>
      </div>
    );
  };
  
  export default ClientPage;
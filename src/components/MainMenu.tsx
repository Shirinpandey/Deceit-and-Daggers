
import { Settings, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#1A1F2C] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
          alt="Background"
          className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
          style={{ opacity: isLoaded ? 0.4 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Top Icons */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-10 animate-fade-in">
        <button 
          onClick={() => navigate("/settings")}
          className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          <Settings className="w-6 h-6 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
          <HelpCircle className="w-6 h-6 text-gray-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 
          className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight animate-fade-in"
          style={{
            textShadow: "0 0 40px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          deceit & daggers
        </h1>
        
        <button 
          onClick={() => navigate("/create-join-game")}
          className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white text-lg font-medium rounded-lg
                     border border-white/20 shadow-lg transform transition-all duration-200
                     hover:scale-105 hover:bg-white/20 hover:border-white/30 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default MainMenu;

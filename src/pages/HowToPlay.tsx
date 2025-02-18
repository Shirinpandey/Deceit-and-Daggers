
import { Settings, HelpCircle } from "lucide-react";

const HowToPlay = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#1A1F2C] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Top Icons */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-10 animate-fade-in">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
          <Settings className="w-6 h-6 text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200">
          <HelpCircle className="w-6 h-6 text-gray-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-16 px-4 min-h-screen">
        <h1 
          className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight animate-fade-in"
          style={{
            textShadow: "0 0 40px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          deceit & daggers
        </h1>
        
        <h2 className="text-2xl md:text-3xl text-white mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          How to Play
        </h2>
        
        <div 
          className="max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 text-gray-200 leading-relaxed animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="mt-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque 
            ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia 
            voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;

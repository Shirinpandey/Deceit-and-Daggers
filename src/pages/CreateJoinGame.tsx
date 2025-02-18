
import { useState } from "react";
import { Settings, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateJoinGame = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form handling logic will be added later
    console.log({ isJoining, playerName, gameCode });
  };

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

        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setIsJoining(false)}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                !isJoining
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              Host Game
            </button>
            <button
              onClick={() => setIsJoining(true)}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                isJoining
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              Join Game
            </button>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 animate-fade-in"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Your Name</Label>
                <Input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter your name"
                />
              </div>

              {isJoining && (
                <div>
                  <Label className="text-white mb-2 block">Game Code</Label>
                  <Input
                    type="text"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter game code"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full px-8 py-3 bg-white/10 text-white text-lg font-medium rounded-lg
                         border border-white/20 shadow-lg transform transition-all duration-200
                         hover:scale-105 hover:bg-white/20 hover:border-white/30"
              >
                {isJoining ? "Join Game" : "Create Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJoinGame;

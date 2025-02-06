import { Settings, HelpCircle } from "lucide-react";

const HowToPlay = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start pt-16 bg-gradient-to-b from-background to-primary/20">
      {/* Top Icons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="icon-button" aria-label="Settings">
          <Settings className="w-6 h-6 text-foreground/80 hover:text-foreground" />
        </button>
        <button className="icon-button" aria-label="Help">
          <HelpCircle className="w-6 h-6 text-foreground/80 hover:text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <h1 className="game-title text-4xl md:text-6xl font-bold text-foreground mb-4">
        deceit & daggers
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-8">
        How to Play
      </h2>

      <div className="max-w-2xl px-6 text-foreground/80">
        <p className="text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
};

export default HowToPlay;
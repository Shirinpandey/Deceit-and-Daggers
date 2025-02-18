
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const navigate = useNavigate();
  const [masterVolume, setMasterVolume] = useState([75]);
  const [musicVolume, setMusicVolume] = useState([50]);
  const [sfxVolume, setSfxVolume] = useState([60]);
  const [showTutorialHints, setShowTutorialHints] = useState(true);
  const [enableFullscreen, setEnableFullscreen] = useState(false);
  const [vibration, setVibration] = useState(true);

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

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
      >
        <ArrowLeft className="w-6 h-6 text-gray-300" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-16 px-4 min-h-screen">
        <h1 
          className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-tight animate-fade-in"
          style={{
            textShadow: "0 0 40px rgba(0,0,0,0.5)",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          Settings
        </h1>

        <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 animate-fade-in">
          {/* Volume Controls */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl text-white mb-4">Audio</h2>
            
            <div className="space-y-2">
              <Label className="text-white">Master Volume</Label>
              <Slider
                value={masterVolume}
                onValueChange={setMasterVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Music Volume</Label>
              <Slider
                value={musicVolume}
                onValueChange={setMusicVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Sound Effects</Label>
              <Slider
                value={sfxVolume}
                onValueChange={setSfxVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="space-y-6">
            <h2 className="text-xl text-white mb-4">Gameplay</h2>
            
            <div className="flex items-center justify-between">
              <Label className="text-white">Show Tutorial Hints</Label>
              <Switch
                checked={showTutorialHints}
                onCheckedChange={setShowTutorialHints}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Enable Fullscreen</Label>
              <Switch
                checked={enableFullscreen}
                onCheckedChange={setEnableFullscreen}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Vibration</Label>
              <Switch
                checked={vibration}
                onCheckedChange={setVibration}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

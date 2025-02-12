import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="max-w-2xl mx-auto space-y-12">
        <h1 className="game-title text-4xl text-center mb-12">Settings</h1>
        
        <div className="space-y-8">
          {/* Audio Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Audio</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-volume">Master Volume</Label>
                <Slider
                  id="master-volume"
                  defaultValue={[75]}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="music-volume">Music Volume</Label>
                <Slider
                  id="music-volume"
                  defaultValue={[60]}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sfx-volume">Sound Effects</Label>
                <Slider
                  id="sfx-volume"
                  defaultValue={[80]}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Game</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tutorial">Show Tutorial Tips</Label>
                <Switch id="tutorial" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Game Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="fullscreen">Fullscreen Mode</Label>
                <Switch id="fullscreen" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
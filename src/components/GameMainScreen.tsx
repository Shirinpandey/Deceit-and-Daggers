import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Settings, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  gameMode: z.enum(["host", "join"]),
  gameCode: z.string().optional().refine((val) => {
    if (val === "") return true;
    return val?.length === 6;
  }, "Game code must be 6 characters")
});

const GameMainScreen = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gameMode: "host",
      gameCode: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Here you would typically handle the game creation/joining
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start pt-16 bg-gradient-to-b from-background to-primary/20">
      {/* Top Icons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="icon-button" aria-label="Settings">
          <Settings className="w-6 h-6 text-foreground/80 hover:text-foreground" />
        </button>
        <button 
          className="icon-button" 
          aria-label="Help"
          onClick={() => navigate("/how-to-play")}
        >
          <HelpCircle className="w-6 h-6 text-foreground/80 hover:text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <h1 className="game-title text-4xl md:text-6xl font-bold text-foreground mb-8">
        deceit & daggers
      </h1>

      <div className="w-full max-w-md px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gameMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Game Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="host" id="host" />
                        <Label htmlFor="host">Create New Game</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="join" id="join" />
                        <Label htmlFor="join">Join Existing Game</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("gameMode") === "join" && (
              <FormField
                control={form.control}
                name="gameCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              {form.watch("gameMode") === "host" ? "Create Game" : "Join Game"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GameMainScreen;
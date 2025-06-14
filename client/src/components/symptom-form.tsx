import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { speechService } from "@/lib/speech";

interface SymptomFormProps {
  onClose: () => void;
}

export default function SymptomForm({ onClose }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter some text before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionId = Date.now().toString();
      const response = await fetch('/api/symptoms/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          content: symptoms,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit symptoms');
      }

      const data = await response.json();
      
      toast({
        title: "Analysis complete",
        description: "Your symptoms have been analyzed",
      });
      
      onClose();
      setLocation(`/analysis/${data.submission.id}`);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error analyzing your symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      if (speechService.isSupported()) {
        speechService.startListening(
          (transcript, isFinal) => {
            setSymptoms(transcript);
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setIsListening(false);
            toast({
              title: "Speech recognition error",
              description: "There was an error with speech recognition. Please try typing instead.",
              variant: "destructive",
            });
          }
        );
        setIsListening(true);
      } else {
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition. Please type your symptoms.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="symptoms" className="text-sm font-medium">
          Describe your symptoms
        </Label>
        <div className="relative mt-2">
          <Textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Please describe how you're feeling, where you feel pain, when symptoms started, and any other relevant details..."
            className="min-h-[120px] pr-12"
            disabled={isListening}
          />
          {speechService.isSupported() && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={toggleSpeechRecognition}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {isListening && (
          <p className="text-xs text-blue-600 mt-1">
            Listening... Speak now to add to your description
          </p>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Be as specific as possible about your symptoms</p>
        <p>• Include when symptoms started and how they've changed</p>
        <p>• Mention any medications you're currently taking</p>
        <p>• Include relevant medical history if applicable</p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !symptoms.trim()}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Analyzing..." : "Send for Analysis"}
      </Button>
    </form>
  );
}

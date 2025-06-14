import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, Pause, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { speechService } from "@/lib/speech";

interface VoiceRecorderProps {
  onClose: () => void;
}

export default function VoiceRecorder({ onClose }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!speechService.isSupported()) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. You can still record audio.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start speech recognition if supported
      if (speechService.isSupported()) {
        speechService.startListening(
          (text, isFinal) => {
            setTranscript(text);
          },
          (error) => {
            console.error('Speech recognition error:', error);
          }
        );
      }
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      speechService.stopListening();
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setTranscript("");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const submitRecording = async () => {
    if (!audioBlob) return;

    setIsSubmitting(true);
    try {
      const sessionId = Date.now().toString();
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/symptoms/audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit recording');
      }

      const data = await response.json();
      
      toast({
        title: "Analysis complete",
        description: "Your voice message has been analyzed",
      });
      
      onClose();
      setLocation(`/analysis/${data.submission.id}`);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error analyzing your recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        {!isRecording && !audioBlob && (
          <div>
            <Mic className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Record your voice message describing your symptoms
            </p>
            <Button onClick={startRecording} className="bg-secondary hover:bg-secondary/90">
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          </div>
        )}

        {isRecording && (
          <div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2" />
              <Badge variant="destructive">Recording...</Badge>
            </div>
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        )}

        {audioBlob && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={isPlaying ? pauseRecording : playRecording}
                variant="outline"
                size="sm"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={deleteRecording} variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={submitRecording} 
              disabled={isSubmitting}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Analyzing..." : "Send for Analysis"}
            </Button>
          </div>
        )}
      </div>

      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Live Transcript:</h4>
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        <p>• Speak clearly and describe your symptoms in detail</p>
        <p>• Recording will be automatically transcribed and analyzed</p>
      </div>
    </div>
  );
}

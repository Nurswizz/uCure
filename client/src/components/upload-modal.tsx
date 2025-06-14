import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mic, Keyboard, Upload, X, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import SymptomForm from "./symptom-form";
import VoiceRecorder from "./voice-recorder";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'photo' | 'voice' | 'text';
}

export default function UploadModal({ isOpen, onClose, initialType }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState(initialType);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const sessionId = Date.now().toString();
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/symptoms/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
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
        title: "Upload failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Share Your Symptoms
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photo" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your image here, or click to select
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className=""
                />

              </label>
            </div>
            {isLoading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
            <p className="text-xs text-gray-500 text-center">
              Supported formats: JPG, PNG, GIF (max 10MB)
            </p>
          </TabsContent>

          <TabsContent value="voice">
            <VoiceRecorder onClose={onClose} />
          </TabsContent>

          <TabsContent value="text">
            <SymptomForm onClose={onClose} />
          </TabsContent>
        </Tabs>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Camera, 
  Mic, 
  Keyboard, 
  Brain, 
  AlertTriangle, 
  Lightbulb,
  Globe,
  Plus,
  Shield,
  Lock,
  UserCheck,
  Ban,
  Bot,
  Check,
  User2Icon
} from "lucide-react";
import UploadModal from "@/components/upload-modal";
import useAuth from "@/hooks/use-auth"

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'voice' | 'text'>('photo');
  const auth = useAuth();

  const handleUploadClick = (type: 'photo' | 'voice' | 'text') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  const handleRedirect = () => {
    if (auth.isAuthenticated) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/auth";
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral">UCare AI</h1>
              <p className="text-sm text-gray-500">Know what your body tells</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={handleRedirect}>
            <User2Icon className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
            alt="Healthcare consultation" 
            className="w-full h-48 object-cover rounded-2xl shadow-lg mb-6" 
          />
          
          <h2 className="text-2xl font-bold text-neutral mb-4 leading-tight">
            Get AI-powered health insights from your symptoms
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Upload photos, describe symptoms, or record voice messages. Our AI will help you understand what your body is telling you.
          </p>
        </div>

        {/* Quick Start CTA */}
        <div className="space-y-4 mb-8">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full bg-primary text-white py-4 px-6 h-auto rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Heart className="mr-3 h-5 w-5" />
            Start Check-Up
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-primary border-2 border-primary py-4 px-6 h-auto rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
            onClick={() => {
              document.getElementById('upload-options')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <AlertTriangle className="mr-3 h-5 w-5" />
            What Can I Upload?
          </Button>
        </div>
      </section>

      {/* Upload Options */}
      <section id="upload-options" className="max-w-md mx-auto px-4 py-6 bg-white rounded-t-3xl shadow-lg">
        <h3 className="text-xl font-bold text-neutral mb-6 text-center">How would you like to share your symptoms?</h3>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Photo Upload */}
          <Card 
            className="bg-blue-50 border-2 border-dashed border-blue-300 hover:border-primary transition-colors cursor-pointer"
            onClick={() => handleUploadClick('photo')}
          >
            <CardContent className="p-6 text-center">
              <Camera className="text-primary text-3xl mb-3 mx-auto" />
              <h4 className="font-semibold text-neutral mb-2">Take or Upload Photo</h4>
              <p className="text-sm text-gray-600 mb-3">Skin conditions, wounds, eyes, or other visible symptoms</p>
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Encrypted & Private
              </Badge>
            </CardContent>
          </Card>

          {/* Voice Message */}
          <Card 
            className="bg-green-50 border-2 border-dashed border-green-300 hover:border-secondary transition-colors cursor-pointer"
            onClick={() => handleUploadClick('voice')}
          >
            <CardContent className="p-6 text-center">
              <Mic className="text-secondary text-3xl mb-3 mx-auto" />
              <h4 className="font-semibold text-neutral mb-2">Record Voice Message</h4>
              <p className="text-sm text-gray-600 mb-3">Describe your symptoms by speaking</p>
              <Badge variant="secondary" className="text-xs">
                <Mic className="w-3 h-3 mr-1" />
                Auto-transcribed
              </Badge>
            </CardContent>
          </Card>

          {/* Text Description */}
          <Card 
            className="bg-amber-50 border-2 border-dashed border-amber-300 hover:border-accent transition-colors cursor-pointer"
            onClick={() => handleUploadClick('text')}
          >
            <CardContent className="p-6 text-center">
              <Keyboard className="text-accent text-3xl mb-3 mx-auto" />
              <h4 className="font-semibold text-neutral mb-2">Type Your Symptoms</h4>
              <p className="text-sm text-gray-600 mb-3">Write about how you're feeling</p>
              <Badge variant="secondary" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Multiple Languages
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-md mx-auto px-4 py-8 bg-gray-50">
        <h3 className="text-xl font-bold text-neutral mb-6 text-center">What happens next?</h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral mb-1">AI Analysis</h4>
              <p className="text-gray-600 text-sm">Our AI reviews your symptoms and provides possible causes</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral mb-1">Urgency Level</h4>
              <p className="text-gray-600 text-sm">Get clear guidance on whether you need immediate care</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="text-white text-lg" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral mb-1">Health Tips</h4>
              <p className="text-gray-600 text-sm">Receive personalized recommendations and next steps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="max-w-md mx-auto px-4 py-8 bg-white">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-neutral mb-4">Trusted by rural communities</h3>
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200" 
            alt="Medical consultation in rural area" 
            className="w-full h-32 object-cover rounded-xl shadow-md mb-4"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-primary mb-1">50K+</div>
            <div className="text-xs text-gray-600">Users helped</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-secondary mb-1">95%</div>
            <div className="text-xs text-gray-600">Accuracy rate</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-accent mb-1">12</div>
            <div className="text-xs text-gray-600">Languages</div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="max-w-md mx-auto px-4 py-6 bg-red-50 border-l-4 border-red-400">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-red-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-2">Emergency Notice</h4>
            <p className="text-red-700 text-sm leading-relaxed">
              If you're experiencing severe symptoms like chest pain, difficulty breathing, severe bleeding, or loss of consciousness, 
              <strong> seek immediate medical attention</strong> or call emergency services.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 py-8 bg-gray-100 text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-white" />
            </div>
            <span className="font-bold text-neutral">UCare AI</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">AI-powered health insights for everyone, everywhere.</p>
        </div>

        {/* Terms of Use */}
        <Card className="bg-white p-4 mb-6 text-left">
          <h5 className="font-semibold text-neutral mb-3 text-center">Terms of Use</h5>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <Check className="text-green-500 mt-0.5 flex-shrink-0 w-3 h-3" />
              <span>UCare AI is not a substitute for a licensed doctor</span>
            </li>
            <li className="flex items-start space-x-2">
              <Lock className="text-blue-500 mt-0.5 flex-shrink-0 w-3 h-3" />
              <span>All data is confidential and encrypted</span>
            </li>
            <li className="flex items-start space-x-2">
              <UserCheck className="text-purple-500 mt-0.5 flex-shrink-0 w-3 h-3" />
              <span>Users must be 16+ or have guardian consent</span>
            </li>
            <li className="flex items-start space-x-2">
              <Ban className="text-red-500 mt-0.5 flex-shrink-0 w-3 h-3" />
              <span>Uploading explicit or non-health-related content is prohibited</span>
            </li>
            <li className="flex items-start space-x-2">
              <Bot className="text-accent mt-0.5 flex-shrink-0 w-3 h-3" />
              <span>By using UCare AI, you agree to receive automated health suggestions only</span>
            </li>
          </ul>
        </Card>

        <div className="text-xs text-gray-500">
          <p>&copy; 2024 UCare AI. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for rural communities worldwide</p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        initialType={uploadType}
      />
    </div>
  );
}

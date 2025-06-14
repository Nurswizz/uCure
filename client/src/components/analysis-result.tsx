import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Brain,
  Lightbulb,
  Clock,
  Phone,
  ArrowLeft,
  Heart,
  Shield,
} from "lucide-react";
import { Link } from "wouter";
import { AnalysisData } from "@/pages/analysis";

export default function AnalysisResult({data}: {data: AnalysisData["analysis"]}) {
  console.log(data);
  console.log(data);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <Heart className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Brain className="text-white text-sm" />
            </div>
            <span className="font-semibold text-neutral">Analysis Results</span>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Emergency Alert */}
        {data.seekImmediateCare && (
          <Alert className="border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              <strong>Seek immediate medical attention.</strong> Your symptoms may require urgent care. Contact emergency services or visit the nearest hospital.
            </AlertDescription>
          </Alert>
        )}

        {/* Urgency Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getUrgencyIcon(data.urgencyLevel)}
              Urgency Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getUrgencyColor(data.urgencyLevel)} className="text-sm">
              {data.urgencyLevel.toUpperCase()} PRIORITY
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              {data.urgencyLevel === "high" && "Immediate attention recommended"}
              {data.urgencyLevel === "medium" && "Consider consulting a healthcare provider soon"}
              {data.urgencyLevel === "low" && "Monitor symptoms and seek care if they worsen"}
            </p>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{data.analysis}</p>
          </CardContent>
        </Card>

        

        {/* Possible Causes */}
        {data.possibleCauses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent" />
                Possible Causes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.possibleCauses.map((cause, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Health Tips */}
        {data.healthTips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-secondary" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.healthTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-secondary">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Important Disclaimer */}
        <Card className="border-gray-300 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600 leading-relaxed">
                <p className="font-semibold mb-2">Important Disclaimer:</p>
                <p>
                  This analysis is generated by AI and is for informational purposes only. 
                  It is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare providers regarding your health concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/">
              <Heart className="h-4 w-4 mr-2" />
              New Symptom Check
            </Link>
          </Button>

          {data.urgencyLevel === "high" && (
            <Button variant="destructive" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency Services
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

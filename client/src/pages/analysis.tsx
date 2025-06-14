import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AnalysisResult from "@/components/analysis-result";

export interface AnalysisData {
  submission: {
    id: number;
    type: string;
    createdAt: string;
  };
  analysis: {
    analysis: string;
    urgencyLevel: 'low' | 'medium' | 'high';
    possibleCauses: string[];
    healthTips: string[];
    seekImmediateCare?: boolean;
  };
  transcribedText?: string;
}
export default function Analysis() {
  const { submissionId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/analysis/${submissionId}`],
    enabled: !!submissionId,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <h1 className="text-xl font-bold text-red-800">Analysis Not Found</h1>
              </div>
              <p className="text-red-700 mb-4">
                We couldn't find the analysis you're looking for. It may have been removed or the link is incorrect.
              </p>
              <Button asChild variant="outline">
                <Link href="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <AnalysisResult data={data as AnalysisData["analysis"]} />;
}

import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleUploadComplete = (fileId: string) => {
    toast({
      title: "Upload Complete!",
      description: "Your meeting file has been processed successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Meeting Knowledge Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your meeting recordings into actionable insights with AI-powered transcription, 
            summaries, and intelligent analysis.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <FileUploader onUploadComplete={handleUploadComplete} />
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
          <div className="text-center p-6 rounded-lg bg-gradient-secondary">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">📝</span>
            </div>
            <h3 className="font-semibold mb-2">Smart Transcription</h3>
            <p className="text-sm text-muted-foreground">
              Accurate AI-powered transcription with speaker identification and timestamps.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-secondary">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Action Items</h3>
            <p className="text-sm text-muted-foreground">
              Automatically extract and track action items with deadlines and assignees.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-secondary">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">📊</span>
            </div>
            <h3 className="font-semibold mb-2">Smart Insights</h3>
            <p className="text-sm text-muted-foreground">
              Analyze sentiment, trends, and meeting effectiveness over time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

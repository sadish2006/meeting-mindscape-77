import { useState, useRef } from 'react';
import { Upload, File, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

interface FileUploaderProps {
  onUploadComplete?: (fileId: string) => void;
}

const FileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    const allowedTypes = ['audio/', 'video/'];
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      setStatus('error');
      return;
    }

    setFileName(file.name);
    simulateUpload(file);
  };

  const simulateUpload = async (file: File) => {
    setStatus('uploading');
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setStatus('processing');
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setStatus('complete');
    onUploadComplete?.('mock-file-id-' + Date.now());
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Clock className="h-5 w-5 animate-spin text-primary" />;
      case 'processing':
        return <Clock className="h-5 w-5 animate-pulse text-warning" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing audio/video...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Upload your meeting file';
    }
  };

  const resetUpload = () => {
    setStatus('idle');
    setProgress(0);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </CardTitle>
        <CardDescription>
          Upload audio or video files from your meetings to generate transcripts, summaries, and insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status === 'idle' && (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-smooth",
              dragActive 
                ? "border-primary bg-accent" 
                : "border-border hover:border-primary hover:bg-muted"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop your meeting file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports MP3, MP4, WAV, and other audio/video formats
            </p>
            <Button variant="outline" className="mt-2">
              Choose File
            </Button>
          </div>
        )}

        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-accent">
              <File className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {status === 'uploading' ? `${progress}% uploaded` : 'Analyzing content...'}
                </p>
              </div>
            </div>
            
            {status === 'uploading' && (
              <Progress value={progress} className="w-full" />
            )}
            
            {status === 'processing' && (
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground">
                  Our AI is transcribing and analyzing your meeting. This may take a few minutes.
                </p>
              </div>
            )}
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-success flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Complete!</h3>
              <p className="text-muted-foreground mb-4">
                Your meeting has been successfully analyzed. You can now view the results in your dashboard.
              </p>
              <div className="flex justify-center space-x-3">
                <Button onClick={resetUpload} variant="outline">
                  Upload Another
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Failed</h3>
              <p className="text-muted-foreground mb-4">
                Please ensure your file is an audio or video format and try again.
              </p>
              <Button onClick={resetUpload}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleFileInput}
        />
      </CardContent>
    </Card>
  );
};

export default FileUploader;
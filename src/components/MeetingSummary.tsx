import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Calendar, TrendingUp } from 'lucide-react';

interface MeetingSummaryProps {
  meeting: {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    summary: string;
    keyDecisions: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
}

const MeetingSummary = ({ meeting }: MeetingSummaryProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success text-success-foreground';
      case 'negative':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{meeting.title}</CardTitle>
              <CardDescription className="mt-2">
                Meeting analysis and summary
              </CardDescription>
            </div>
            <Badge 
              className={`${getSentimentColor(meeting.sentiment)} capitalize`}
            >
              {getSentimentIcon(meeting.sentiment)} {meeting.sentiment}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{meeting.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{meeting.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-medium">{meeting.confidence}%</span>
            </div>
          </div>

          <Separator />

          {/* Participants */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Participants</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {meeting.participants.map((participant, index) => (
                <Badge key={index} variant="secondary">
                  {participant}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-3">Meeting Summary</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {meeting.summary}
              </p>
            </div>
          </div>

          <Separator />

          {/* Key Decisions */}
          <div>
            <h3 className="font-semibold mb-3">Key Decisions</h3>
            <div className="space-y-3">
              {meeting.keyDecisions.map((decision, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {decision}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingSummary;
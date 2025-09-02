import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MeetingSummary from '@/components/MeetingSummary';
import ActionList from '@/components/ActionList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Play, Download } from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  isOverdue: boolean;
}

// Mock data - replace with actual API calls
const mockMeeting = {
  id: 'meeting-1',
  title: 'Q4 Strategic Planning Session',
  date: 'December 15, 2024',
  duration: '1h 35m',
  participants: ['Sarah Johnson', 'Mike Chen', 'Jessica Williams', 'Alex Thompson', 'David Rodriguez'],
  summary: 'The Q4 strategic planning session focused on budget allocation, project prioritization, and resource planning for the upcoming quarter. The team discussed the progress of current initiatives and identified key areas for improvement. Budget allocation was a major topic, with the marketing team requesting additional funding for digital campaigns. The product team presented their roadmap for Q1 2024, highlighting three major feature releases. HR discussed talent acquisition needs and proposed changes to the onboarding process.',
  keyDecisions: [
    'Approved 15% increase in marketing budget for Q1 digital campaigns',
    'Decided to postpone the mobile app redesign until Q2 to focus on core features',
    'Established weekly cross-team standup meetings starting January 2024',
    'Approved hiring of two additional frontend developers by February',
    'Selected Slack as the primary communication tool for all teams'
  ],
  sentiment: 'positive' as const,
  confidence: 87
};

const mockActions: ActionItem[] = [
  {
    id: 'action-1',
    title: 'Finalize Q1 marketing budget proposal',
    description: 'Create detailed breakdown of digital campaign spending and ROI projections',
    assignee: 'Sarah Johnson',
    deadline: 'Dec 20, 2024',
    priority: 'high',
    status: 'in-progress',
    isOverdue: false
  },
  {
    id: 'action-2',
    title: 'Update project timeline documentation',
    description: 'Reflect Q1 priorities and adjusted milestones in project management system',
    assignee: 'Mike Chen',
    deadline: 'Dec 18, 2024',
    priority: 'medium',
    status: 'pending',
    isOverdue: true
  },
  {
    id: 'action-3',
    title: 'Draft job descriptions for frontend roles',
    description: 'Create comprehensive job descriptions for two frontend developer positions',
    assignee: 'Jessica Williams',
    deadline: 'Dec 22, 2024',
    priority: 'medium',
    status: 'pending',
    isOverdue: false
  },
  {
    id: 'action-4',
    title: 'Research Slack integration options',
    description: 'Evaluate integration possibilities with existing tools and workflows',
    assignee: 'Alex Thompson',
    deadline: 'Dec 16, 2024',
    priority: 'low',
    status: 'completed',
    isOverdue: false
  }
];

const mockTranscript = `[00:00:00] Sarah Johnson: Good morning everyone, thank you for joining today's Q4 strategic planning session. I'd like to start by reviewing our current progress and discussing priorities for Q1.

[00:01:30] Mike Chen: Thanks Sarah. Let me share the current development status. We're on track with most of our Q4 deliverables, but the mobile app redesign is taking longer than expected.

[00:02:45] Jessica Williams: From a marketing perspective, we've seen strong engagement with our current campaigns. I'd like to propose increasing our digital marketing budget for Q1 to capitalize on this momentum.

[00:04:12] Alex Thompson: The design team has completed the user research for the mobile app, but implementing the changes will require more time than originally allocated.

[00:05:30] David Rodriguez: As product owner, I think we should prioritize core features over the redesign. We can revisit the mobile app improvements in Q2.

[Continue with more transcript content...]`;

const Dashboard = () => {
  const [meeting, setMeeting] = useState(mockMeeting);
  const [actions, setActions] = useState<ActionItem[]>(mockActions);
  const [transcript, setTranscript] = useState(mockTranscript);

  const handleActionUpdate = (actionId: string, completed: boolean) => {
    setActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: completed ? 'completed' : 'pending' }
          : action
      )
    );
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${meeting.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meeting Dashboard</h1>
            <p className="text-muted-foreground">
              View and manage your meeting analysis results
            </p>
          </div>
          <Button onClick={downloadTranscript} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Transcript
          </Button>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary & Insights</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
            <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <MeetingSummary meeting={meeting} />
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <ActionList actions={actions} onActionUpdate={handleActionUpdate} />
          </TabsContent>

          <TabsContent value="transcript" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Meeting Transcript</span>
                </CardTitle>
                <CardDescription>
                  Complete transcription with speaker identification and timestamps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {transcript}
                  </pre>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                  <span>Transcript generated with 94% confidence</span>
                  <Button onClick={downloadTranscript} variant="ghost" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
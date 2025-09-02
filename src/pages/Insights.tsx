import Layout from '@/components/Layout';
import InsightsChart from '@/components/InsightsChart';

// Mock data for insights
const mockInsightsData = {
  sentimentTrend: [
    { date: 'Nov 1', sentiment: 0.65, meetings: 3 },
    { date: 'Nov 8', sentiment: 0.58, meetings: 4 },
    { date: 'Nov 15', sentiment: 0.72, meetings: 2 },
    { date: 'Nov 22', sentiment: 0.61, meetings: 3 },
    { date: 'Nov 29', sentiment: 0.68, meetings: 5 },
    { date: 'Dec 6', sentiment: 0.75, meetings: 4 },
    { date: 'Dec 13', sentiment: 0.71, meetings: 6 },
  ],
  deadlinePerformance: [
    { week: 'Week 1', completed: 8, missed: 2 },
    { week: 'Week 2', completed: 12, missed: 1 },
    { week: 'Week 3', completed: 9, missed: 3 },
    { week: 'Week 4', completed: 15, missed: 2 },
    { week: 'Week 5', completed: 11, missed: 4 },
    { week: 'Week 6', completed: 13, missed: 1 },
  ],
  meetingTypes: [
    { type: 'Strategic Planning', count: 8, color: 'hsl(var(--primary))' },
    { type: 'Team Standup', count: 15, color: 'hsl(var(--success))' },
    { type: 'Client Meeting', count: 6, color: 'hsl(var(--warning))' },
    { type: 'Retrospective', count: 4, color: 'hsl(var(--destructive))' },
    { type: 'One-on-One', count: 12, color: 'hsl(var(--accent))' },
  ],
  monthlyStats: {
    totalMeetings: 45,
    completionRate: 78,
    avgSentiment: 0.68,
    trendDirection: 'up' as const,
  }
};

const Insights = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Meeting Insights</h1>
          <p className="text-muted-foreground">
            Analyze trends, performance, and patterns in your meeting data
          </p>
        </div>

        <InsightsChart data={mockInsightsData} />
      </div>
    </Layout>
  );
};

export default Insights;
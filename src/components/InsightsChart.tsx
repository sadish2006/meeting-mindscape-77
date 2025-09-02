import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface InsightsChartProps {
  data: {
    sentimentTrend: Array<{ date: string; sentiment: number; meetings: number }>;
    deadlinePerformance: Array<{ week: string; completed: number; missed: number }>;
    meetingTypes: Array<{ type: string; count: number; color: string }>;
    monthlyStats: {
      totalMeetings: number;
      completionRate: number;
      avgSentiment: number;
      trendDirection: 'up' | 'down';
    };
  };
}

const InsightsChart = ({ data }: InsightsChartProps) => {
  const { sentimentTrend, deadlinePerformance, meetingTypes, monthlyStats } = data;

  const formatSentiment = (value: number) => {
    if (value >= 0.6) return 'Positive';
    if (value >= 0.4) return 'Neutral';
    return 'Negative';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Meetings</p>
                <p className="text-2xl font-bold">{monthlyStats.totalMeetings}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{monthlyStats.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Sentiment</p>
                <p className="text-2xl font-bold">{formatSentiment(monthlyStats.avgSentiment)}</p>
              </div>
              {monthlyStats.trendDirection === 'up' ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trend</p>
                <p className="text-2xl font-bold capitalize">
                  {monthlyStats.trendDirection === 'up' ? 'Improving' : 'Declining'}
                </p>
              </div>
              {monthlyStats.trendDirection === 'up' ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
          <TabsTrigger value="deadlines">Deadline Performance</TabsTrigger>
          <TabsTrigger value="types">Meeting Types</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Sentiment Over Time</CardTitle>
              <CardDescription>
                Track the overall sentiment and mood of your meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 1]}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="sentiment" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines">
          <Card>
            <CardHeader>
              <CardTitle>Deadline Performance</CardTitle>
              <CardDescription>
                Compare completed vs missed deadlines over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deadlinePerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="week" 
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="completed" 
                      fill="hsl(var(--success))" 
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="missed" 
                      fill="hsl(var(--destructive))" 
                      name="Missed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Distribution</CardTitle>
              <CardDescription>
                Breakdown of your meetings by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={meetingTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {meetingTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsChart;
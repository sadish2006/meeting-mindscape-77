import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ActionListProps {
  actions: ActionItem[];
  onActionUpdate?: (actionId: string, completed: boolean) => void;
}

const ActionList = ({ actions, onActionUpdate }: ActionListProps) => {
  const [localActions, setLocalActions] = useState(actions);

  const handleStatusChange = (actionId: string, completed: boolean) => {
    setLocalActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: completed ? 'completed' : 'pending' }
          : action
      )
    );
    onActionUpdate?.(actionId, completed);
  };

  const getPriorityColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue) return 'bg-destructive text-destructive-foreground';
    
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const completedCount = localActions.filter(action => action.status === 'completed').length;
  const overdueCount = localActions.filter(action => action.isOverdue && action.status !== 'completed').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Action Items</span>
            </CardTitle>
            <CardDescription>
              Track and manage follow-up actions from your meeting
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary">
              {completedCount}/{localActions.length} Completed
            </Badge>
            {overdueCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {overdueCount} Overdue
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {localActions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "border rounded-lg p-4 transition-all duration-smooth",
                action.status === 'completed' 
                  ? "bg-muted/50 border-success/20" 
                  : action.isOverdue 
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-border hover:bg-accent/50"
              )}
            >
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={action.status === 'completed'}
                  onCheckedChange={(checked) => 
                    handleStatusChange(action.id, checked as boolean)
                  }
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className={cn(
                        "font-medium",
                        action.status === 'completed' && "line-through text-muted-foreground"
                      )}>
                        {action.title}
                      </h4>
                      <p className={cn(
                        "text-sm text-muted-foreground",
                        action.status === 'completed' && "line-through"
                      )}>
                        {action.description}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Badge 
                        className={getPriorityColor(action.priority, action.isOverdue)}
                      >
                        {action.isOverdue ? 'Overdue' : action.priority}
                      </Badge>
                      <Badge 
                        className={getStatusColor(action.status)}
                      >
                        {action.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{action.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{action.deadline}</span>
                    </div>
                    {action.isOverdue && action.status !== 'completed' && (
                      <div className="flex items-center space-x-1 text-destructive">
                        <Clock className="h-3 w-3" />
                        <span>Past Due</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {localActions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No action items found in this meeting.</p>
            </div>
          )}
        </div>
        
        {overdueCount > 0 && (
          <div className="mt-6 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">Attention Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You have {overdueCount} overdue action item{overdueCount > 1 ? 's' : ''}. 
              Consider following up with the assignees or adjusting deadlines.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionList;
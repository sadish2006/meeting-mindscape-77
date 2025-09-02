import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatUIProps {
  onSendMessage?: (message: string) => Promise<string>;
}

const ChatUI = ({ onSendMessage }: ChatUIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI meeting assistant. I can help you find information about your meetings, action items, participants, and more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add typing indicator
      const typingMessage: Message = {
        id: 'typing',
        content: '',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true,
      };
      
      setMessages(prev => [...prev, typingMessage]);

      // Simulate API call or use actual API
      const response = onSendMessage 
        ? await onSendMessage(userMessage.content)
        : await simulateAIResponse(userMessage.content);

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'bot',
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const input = userInput.toLowerCase();

    if (input.includes('meeting') && input.includes('summary')) {
      return "I found your most recent meeting summary: 'Q4 Planning Session' held on December 15th. The team discussed budget allocation, project timelines, and resource planning. Key decisions included increasing the marketing budget by 15% and moving the product launch to Q1 2024.";
    }
    
    if (input.includes('action') || input.includes('task')) {
      return "Here are your pending action items:\n\n1. Review Q4 budget proposal (Due: Dec 20) - Assigned to Sarah\n2. Update project timeline (Due: Dec 18) - Assigned to Mike\n3. Prepare marketing materials (Due: Dec 22) - Assigned to Jessica\n\nWould you like more details on any of these items?";
    }
    
    if (input.includes('participant') || input.includes('attendee')) {
      return "Your recent meetings included these participants:\n\n• Sarah Johnson (Project Manager)\n• Mike Chen (Developer)\n• Jessica Williams (Marketing)\n• Alex Thompson (Designer)\n• David Rodriguez (Product Owner)\n\nWould you like to see meeting participation patterns or contact information?";
    }
    
    if (input.includes('sentiment') || input.includes('mood')) {
      return "Based on the analysis of your recent meetings:\n\n📈 Overall sentiment: Positive (72%)\n😊 Most positive meeting: 'Team Retrospective' (85% positive)\n😐 Most neutral meeting: 'Budget Review' (60% neutral)\n\nThe team seems engaged and optimistic about upcoming projects!";
    }
    
    if (input.includes('deadline') || input.includes('due')) {
      return "Here's your deadline overview:\n\n✅ Completed on time: 8 out of 10 items (80%)\n⏰ Upcoming deadlines:\n• Project proposal review (2 days)\n• Client presentation prep (5 days)\n• Team performance reviews (1 week)\n\nYour team has been performing well with deadline management!";
    }

    // Default response for unrecognized queries
    return "I can help you with information about:\n\n• Meeting summaries and transcripts\n• Action items and deadlines\n• Participant information\n• Meeting sentiment analysis\n• Deadline performance\n\nWhat specific information would you like to explore?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQueries = [
    "Show me my latest meeting summary",
    "What action items are pending?",
    "How is team sentiment trending?",
    "Who attended my last meeting?",
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span>AI Meeting Assistant</span>
        </CardTitle>
        <CardDescription>
          Ask questions about your meetings, action items, and insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.sender === 'user' && "flex-row-reverse space-x-reverse"
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={cn(
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent text-accent-foreground"
                  )}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn(
                  "flex flex-col space-y-1 max-w-[80%]",
                  message.sender === 'user' && "items-end"
                )}>
                  <div className={cn(
                    "rounded-lg px-4 py-2 text-sm",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {message.isTyping ? (
                      <div className="flex items-center space-x-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground px-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(query)}
                  className="text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your meetings..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatUI;
import Layout from '@/components/Layout';
import ChatUI from '@/components/ChatUI';

const Chat = () => {
  const handleSendMessage = async (message: string): Promise<string> => {
    // This would typically make an API call to your backend
    // For now, we'll use the mock responses from the ChatUI component
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a mock response. In a real implementation, this would call your backend API.");
      }, 1000);
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about your meetings and get intelligent insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ChatUI onSendMessage={handleSendMessage} />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
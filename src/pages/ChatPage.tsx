
import { PremiumAIChat } from '../components/premium/PremiumAIChat';
import { SEOHead, seoConfigs } from '../components/seo/SEOHead';

export const ChatPage: React.FC = () => {
  return (
    <>
      <SEOHead {...seoConfigs.chat} />
      <div className="h-full flex flex-col">
        <PremiumAIChat />
      </div>
    </>
  );
};

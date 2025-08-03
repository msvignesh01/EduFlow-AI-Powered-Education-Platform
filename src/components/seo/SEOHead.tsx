import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  canonical?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'EduLearn - Premium AI-Powered Learning Platform',
  description = 'Transform your learning experience with EduLearn\'s AI-powered platform. Interactive courses, personalized study plans, and intelligent tutoring for accelerated learning.',
  keywords = [
    'online learning',
    'AI education',
    'interactive courses',
    'study platform',
    'personalized learning',
    'educational technology',
    'e-learning',
    'AI tutor',
    'study notes',
    'learning analytics'
  ],
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'EduLearn Team',
  publishedTime,
  modifiedTime,
  noIndex = false,
  canonical,
}) => {
  const siteTitle = 'EduLearn';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const keywordsString = keywords.join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@edulearn" />
      <meta name="twitter:site" content="@edulearn" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="application-name" content={siteTitle} />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": siteTitle,
          "description": description,
          "url": url,
          "logo": {
            "@type": "ImageObject",
            "url": `${url}/logo.png`
          },
          "sameAs": [
            "https://twitter.com/edulearn",
            "https://linkedin.com/company/edulearn",
            "https://github.com/edulearn"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-EDU-LEARN",
            "contactType": "customer service",
            "email": "support@edulearn.com"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          }
        })}
      </script>
    </Helmet>
  );
};

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'EduLearn - Premium AI-Powered Learning Platform',
    description: 'Transform your learning experience with EduLearn\'s AI-powered platform. Interactive courses, personalized study plans, and intelligent tutoring.',
    keywords: ['online learning', 'AI education', 'interactive courses', 'study platform']
  },
  
  dashboard: {
    title: 'Dashboard - EduLearn',
    description: 'Your personalized learning dashboard with progress tracking, AI insights, and study analytics.',
    keywords: ['learning dashboard', 'study progress', 'learning analytics', 'AI insights']
  },
  
  courses: {
    title: 'Courses - EduLearn',
    description: 'Explore our comprehensive library of interactive courses powered by AI technology.',
    keywords: ['online courses', 'interactive learning', 'AI courses', 'educational content']
  },
  
  profile: {
    title: 'Profile - EduLearn',
    description: 'Manage your learning profile, preferences, and achievements on EduLearn.',
    keywords: ['user profile', 'learning preferences', 'achievements', 'account settings']
  },
  
  chat: {
    title: 'AI Chat - EduLearn',
    description: 'Get instant help and explanations from our advanced AI tutor. Ask questions and learn interactively.',
    keywords: ['AI tutor', 'chat learning', 'instant help', 'AI assistant', 'educational chat']
  },
  
  // Removed demo SEO config - no longer needed
  
  studyAnalysis: {
    title: 'Study Analysis - EduLearn',
    description: 'Analyze your learning patterns and get AI-powered insights to optimize your study sessions.',
    keywords: ['study analysis', 'learning analytics', 'AI insights', 'performance tracking']
  }
};

// Hook for easy SEO management
export const useSEO = (pageKey: keyof typeof seoConfigs, customConfig?: Partial<SEOHeadProps>) => {
  const config = seoConfigs[pageKey];
  const mergedConfig = { ...config, ...customConfig };
  
  return <SEOHead {...mergedConfig} />;
};

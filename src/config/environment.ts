export interface EnvironmentConfig {
  API_URL: string;
  GEMINI_API_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DEBUG: boolean;
  VERSION: string;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = import.meta.env;
  
  return {
    API_URL: env.VITE_API_URL || 'http:
    GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || '',
    FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID || '',
    FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID || '',
    ENVIRONMENT: (env.VITE_ENVIRONMENT as any) || 'development',
    DEBUG: env.VITE_DEBUG === 'true' || env.MODE === 'development',
    VERSION: env.VITE_VERSION || '1.0.0',
  };
};

export const config = getEnvironmentConfig();


export const isDevelopment = config.ENVIRONMENT === 'development';
export const isProduction = config.ENVIRONMENT === 'production';
export const isStaging = config.ENVIRONMENT === 'staging';


export const validateConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!config.API_URL) {
    errors.push('API_URL is required');
  }
  
  if (isProduction) {
    if (!config.GEMINI_API_KEY) {
      errors.push('GEMINI_API_KEY is required in production');
    }
    
    if (!config.FIREBASE_API_KEY) {
      errors.push('FIREBASE_API_KEY is required in production');
    }
  }
  
  return errors;
};


if (isDevelopment) {
  console.log('Environment Configuration:', config);
  
  const configErrors = validateConfig();
  if (configErrors.length > 0) {
    console.warn('Configuration warnings:', configErrors);
  }
}

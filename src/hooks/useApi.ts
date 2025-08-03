import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { showToast } from '../components/ui/Toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  } = {}
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      if (options.showSuccessToast && options.successMessage) {
        showToast.success(options.successMessage);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      if (options.onError) {
        options.onError(error as Error);
      }

      if (options.showErrorToast !== false) {
        showToast.error(errorMessage);
      }

      return null;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common API operations
export const useContentGeneration = () => {
  return useApi(
    (text: string, outputType: string) => apiClient.generateContent(text, outputType),
    {
      showSuccessToast: true,
      successMessage: 'Content generated successfully!',
      showErrorToast: true,
    }
  );
};

export const useFileUpload = () => {
  return useApi(
    (file: File, outputType: string) => apiClient.uploadFile(file, outputType),
    {
      showSuccessToast: true,
      successMessage: 'File processed successfully!',
      showErrorToast: true,
    }
  );
};

export const useUserProfile = () => {
  return useApi(
    () => apiClient.getCurrentUser(),
    {
      showErrorToast: true,
    }
  );
};

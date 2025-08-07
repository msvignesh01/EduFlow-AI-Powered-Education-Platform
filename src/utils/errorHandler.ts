import { showToast } from '../components/ui/Toast';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
}

export class ErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    originalError?: Error,
    statusCode?: number
  ): AppError {
    return {
      type,
      message,
      originalError,
      statusCode,
    };
  }

  static fromHttpError(error: any): AppError {
    if (!error.response) {
      return this.createError(
        ErrorType.NETWORK,
        'Network error. Please check your connection.',
        error
      );
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        return this.createError(
          ErrorType.AUTHENTICATION,
          'Please sign in to continue.',
          error,
          status
        );
      case 403:
        return this.createError(
          ErrorType.AUTHORIZATION,
          'You do not have permission to perform this action.',
          error,
          status
        );
      case 422:
        return this.createError(
          ErrorType.VALIDATION,
          data?.detail || 'Invalid input data.',
          error,
          status
        );
      case 500:
        return this.createError(
          ErrorType.SERVER,
          'Server error. Please try again later.',
          error,
          status
        );
      default:
        return this.createError(
          ErrorType.UNKNOWN,
          data?.detail || 'An unexpected error occurred.',
          error,
          status
        );
    }
  }

  static handle(error: AppError | Error, showToastNotification = true): void {
    let appError: AppError;

    if (error instanceof Error) {
      appError = this.createError(
        ErrorType.UNKNOWN,
        error.message || 'An unexpected error occurred.',
        error
      );
    } else {
      appError = error;
    }


    console.error('Error handled:', appError);


    if (showToastNotification) {
      switch (appError.type) {
        case ErrorType.NETWORK:
          showToast.error('Connection problem. Please check your internet.');
          break;
        case ErrorType.AUTHENTICATION:
          showToast.warning('Please sign in to continue.');
          break;
        case ErrorType.AUTHORIZATION:
          showToast.warning('You do not have permission for this action.');
          break;
        case ErrorType.VALIDATION:
          showToast.error(appError.message);
          break;
        case ErrorType.SERVER:
          showToast.error('Server error. Please try again later.');
          break;
        default:
          showToast.error(appError.message);
      }
    }



  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    customErrorMessage?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      const appError = error instanceof Error 
        ? this.createError(ErrorType.UNKNOWN, customErrorMessage || error.message, error)
        : this.fromHttpError(error);
      
      this.handle(appError);
      return null;
    }
  }
}


export const handleApiError = (error: any): AppError => {
  return ErrorHandler.fromHttpError(error);
};

export const withErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorMessage?: string
) => {
  return async (...args: T): Promise<R | null> => {
    return ErrorHandler.withErrorHandling(() => fn(...args), errorMessage);
  };
};

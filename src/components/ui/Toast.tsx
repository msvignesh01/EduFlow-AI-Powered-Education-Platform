import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Custom toast components
const SuccessToast = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="h-5 w-5 text-green-500" />
    <span className="text-gray-900 dark:text-white">{message}</span>
  </div>
);

const ErrorToast = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2">
    <XCircle className="h-5 w-5 text-red-500" />
    <span className="text-gray-900 dark:text-white">{message}</span>
  </div>
);

const WarningToast = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2">
    <AlertCircle className="h-5 w-5 text-yellow-500" />
    <span className="text-gray-900 dark:text-white">{message}</span>
  </div>
);

const InfoToast = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2">
    <Info className="h-5 w-5 text-blue-500" />
    <span className="text-gray-900 dark:text-white">{message}</span>
  </div>
);

// Toast utility functions
export const showToast = {
  success: (message: string) => {
    toast.custom(<SuccessToast message={message} />, {
      duration: 4000,
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-border)',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },
  
  error: (message: string) => {
    toast.custom(<ErrorToast message={message} />, {
      duration: 5000,
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-border)',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },
  
  warning: (message: string) => {
    toast.custom(<WarningToast message={message} />, {
      duration: 4000,
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-border)',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },
  
  info: (message: string) => {
    toast.custom(<InfoToast message={message} />, {
      duration: 3000,
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-border)',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  },
};

// Toast container component
export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 80,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          border: '1px solid var(--toast-border)',
        },
      }}
    />
  );
};

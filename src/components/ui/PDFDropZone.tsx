import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFDropZoneProps {
  onFileAccepted: (file: File) => void;
}

export const PDFDropZone: React.FC<PDFDropZoneProps> = ({ onFileAccepted }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('File accepted:', file.name);
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p className="text-gray-600 dark:text-gray-300">Drop the file here...</p>
          : <p className="text-gray-500 dark:text-gray-400">Drag & drop a PDF or Word doc here, or click to upload</p>
      }
    </div>
  );
};

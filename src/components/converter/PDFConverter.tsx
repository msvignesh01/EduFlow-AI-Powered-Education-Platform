import React, { useState } from 'react';
import { Upload, BookOpen, Video, Gamepad2, FileText, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const PDFConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  
  const conversionFormats = [
    { id: 'short_notes', name: 'Short Notes', icon: <FileText size={20} />, description: 'Concise summaries of key concepts' },
    { id: 'long_notes', name: 'Long Notes', icon: <BookOpen size={20} />, description: 'Detailed explanations with examples' },
    { id: 'video', name: 'Video Explanation', icon: <Video size={20} />, description: 'Animated video explanations of concepts' },
    { id: 'game', name: 'Gamified Learning', icon: <Gamepad2 size={20} />, description: 'Interactive quizzes and games' },
  ];
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };
  
  const handleConvert = () => {
    if (file && selectedFormats.length > 0) {
      setIsConverting(true);

      setTimeout(() => {
        setIsConverting(false);
        setConversionComplete(true);
      }, 3000);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setSelectedFormats([]);
    setConversionComplete(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Converter</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload your study materials and convert them into the format that works best for your learning style.
        </p>
      </div>
      
      {!conversionComplete ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Document</CardTitle>
              <CardDescription>
                Drag and drop your PDF file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
                  ${file ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-300">
                      <Check size={24} />
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Upload size={24} />
                    </div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      PDF files only, max 10MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Select Conversion Formats</CardTitle>
              <CardDescription>
                Choose one or more formats to convert your PDF into
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversionFormats.map((format) => (
                  <div 
                    key={format.id}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${selectedFormats.includes(format.id) 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                    `}
                    onClick={() => toggleFormat(format.id)}
                  >
                    <div className="flex items-start">
                      <div className={`
                        p-2 rounded-full mr-3
                        ${selectedFormats.includes(format.id) 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                      `}>
                        {format?.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{format.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button
              onClick={handleConvert}
              isLoading={isConverting}
              disabled={!file || selectedFormats.length === 0 || isConverting}
            >
              {isConverting ? 'Converting...' : 'Convert PDF'}
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center text-green-600 dark:text-green-300 mb-6">
                <Check size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Conversion Complete!</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your PDF has been successfully converted into the selected formats.
              </p>
              
              <div className="mt-8 space-y-4">
                {selectedFormats.map((formatId) => {
                  const format = conversionFormats.find(f => f.id === formatId);
                  return (
                    <div 
                      key={formatId}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3">
                          {format?.icon}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{format?.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8">
                <Button onClick={resetForm}>
                  Convert Another PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFConverter;

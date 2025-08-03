/* import React, { useState } from 'react';
import { PDFDropZone } from '../components/ui/PDFDropZone';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';


const outputOptions = ['Short Notes', 'Long Notes', 'Video Summary', 'Gamified Content'];

const TutorPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadedFile(null);
      setErrorMessage('Only PDF or Word documents are allowed.');
      return;
    }

    setErrorMessage(null);
    setUploadedFile(file);
    setSelectedOutput(null);
    await extractTextFromFile(file);
  };

  const extractTextFromFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let text = '';
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }

        setFileContent(text);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setFileContent(result.value);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleOutputSelect = (option: string) => {
    setSelectedOutput(option);
    console.log('Selected output:', option);
    console.log('Extracted text:\n', fileContent); // <-- to confirm it's working
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Upload Your Study Material</h1>

      <Card>
        <PDFDropZone onFileAccepted={handleFileUpload} />
      </Card>

      {errorMessage && (
        <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {uploadedFile && (
        <>
          <div className="mt-4 p-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow">
            <p><strong>Filename:</strong> {uploadedFile.name}</p>
            <p><strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {uploadedFile.type}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
              What kind of output do you want?
            </h2>

            <div className="flex flex-wrap gap-3">
              {outputOptions.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleOutputSelect(option)}
                  className={`px-4 py-2 ${
                    selectedOutput === option
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {selectedOutput && (
              <div className="mt-4 text-green-600 dark:text-green-400 font-medium">
                Output type selected: {selectedOutput}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TutorPage;*/

import React, { useState } from 'react';
import { PDFDropZone } from '../components/ui/PDFDropZone';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { extractTextFromPDF, extractTextFromDocx } from '../lib/fileParser';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/ui/Toast';
import { LoadingOverlay } from '../components/ui/LoadingSpinner';
import { useContentGeneration, useFileUpload } from '../hooks/useApi';
import { ErrorHandler } from '../utils/errorHandler';

const outputOptions = ['Short Notes', 'Long Notes', 'Video Summary', 'Gamified Content'];

const TutorPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const { isAuthenticated } = useAuthStore();
  const contentGeneration = useContentGeneration();
  const fileUpload = useFileUpload();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setSelectedOutput(null);
    contentGeneration.reset();

    try {
      let textContent = '';
      if (file.type === 'application/pdf') {
        textContent = await extractTextFromPDF(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        textContent = await extractTextFromDocx(file);
      } else {
        throw new Error('Unsupported file type');
      }

      setFileContent(textContent);
      showToast.success('File uploaded and processed successfully!');
    } catch (error) {
      ErrorHandler.handle(error as Error);
      setUploadedFile(null);
      setFileContent('');
    }
  };

  const handleOutputSelect = async (option: string) => {
    if (!isAuthenticated) {
      showToast.warning('Please sign in to generate content');
      return;
    }

    if (!fileContent.trim()) {
      showToast.error('Please upload a file first');
      return;
    }

    setSelectedOutput(option);
    await contentGeneration.execute(fileContent, option.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Study Assistant</h1>
        {!isAuthenticated && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            Sign in to generate content
          </div>
        )}
      </div>

      <LoadingOverlay isLoading={contentGeneration.loading} message="Generating content...">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Your Study Material
            </h2>
            <PDFDropZone onFileAccepted={handleFileUpload} />
          </div>
        </Card>

        {contentGeneration.error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{contentGeneration.error}</p>
          </div>
        )}

        {uploadedFile && (
          <>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  File Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Filename:</span>
                    <p className="text-gray-900 dark:text-white">{uploadedFile.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Size:</span>
                    <p className="text-gray-900 dark:text-white">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Type:</span>
                    <p className="text-gray-900 dark:text-white">
                      {uploadedFile.type.includes('pdf') ? 'PDF Document' : 'Word Document'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Output Type
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {outputOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleOutputSelect(option)}
                      variant={selectedOutput === option ? 'primary' : 'outline'}
                      disabled={contentGeneration.loading || !isAuthenticated}
                      className="h-12"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </LoadingOverlay>

      {contentGeneration.data && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated {selectedOutput}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(contentGeneration.data?.result || '')}
              >
                Copy
              </Button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-sans">
                  {contentGeneration.data?.result}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TutorPage;



import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseCSV, parseCSVData } from '../utils/csvParser';

interface CSVUploaderProps {
  onDataLoaded: (data: { people: any[], funds: any[] }) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setStatus('error');
      setErrorMessage('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setStatus('processing');
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const text = await file.text();
      const csvRows = parseCSV(text);
      
      clearInterval(progressInterval);
      setUploadProgress(95);

      console.log(`Parsed ${csvRows.length} rows from CSV`);
      
      const { people, funds } = parseCSVData(csvRows);
      
      setUploadProgress(100);
      setStatus('success');
      
      console.log(`Processed ${people.length} people and ${funds.length} funds`);
      
      // Call the callback with the parsed data
      onDataLoaded({ people, funds });
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      setStatus('error');
      setErrorMessage('Error processing CSV file. Please check the format.');
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
        if (status !== 'error') {
          setStatus('idle');
        }
      }, 2000);
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="mb-4">
          <Upload className="h-12 w-12 mx-auto text-slate-400" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Upload Your VC Data</h3>
        <p className="text-slate-600 mb-4">
          Upload your CSV file containing LinkedIn profile data to power the intelligence platform
        </p>

        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-slate-600">Processing CSV data...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Data loaded successfully!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-left">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-slate-600" />
            <span className="font-medium text-sm">Expected CSV Format:</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• firstName, lastName columns for names</li>
            <li>• jobExperience_N_company_name for companies</li>
            <li>• education_N_company_name for institutions</li>
            <li>• skills_N for skills data</li>
            <li>• languages_N_language for languages</li>
            <li>• location_address for location</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

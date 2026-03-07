import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Database,
  CheckCircle2,
  AlertCircle,
  X,
  Rocket,
  Globe,
  Loader2,
  ArrowRight,
  Eye,
  BarChart3, // ✅ Added for Analytics button
} from 'lucide-react';
import { DataProcessingLoader } from '../components/common/Loader';
import CoordinateViewer from '../components/visualization/CoordinateViewer';
import { useNavigate } from 'react-router-dom';

const UploadData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSource, setSelectedSource] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [rawDatasetId, setRawDatasetId] = useState(null);
  const [normalizedDatasetId, setNormalizedDatasetId] = useState(null);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [showAnalyticsButton, setShowAnalyticsButton] = useState(false); // ✅ New state
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch available data sources
  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    setLoadingSources(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/ingestion/sources', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }
      
      const data = await response.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error('Error fetching sources:', err);
      // Fallback sources
      setSources([
        { id: 1, name: 'NASA', icon: '🚀', description: 'NASA Exoplanet Archive, MAST, etc.' },
        { id: 2, name: 'ESA', icon: '🛸', description: 'Gaia, XMM-Newton, Herschel data' },
        { id: 3, name: 'Observatory', icon: '🔭', description: 'Ground-based observations' },
        { id: 4, name: 'Other', icon: '📡', description: 'Custom or third-party sources' },
      ]);
    } finally {
      setLoadingSources(false);
    }
  };

  const processingSteps = [
    'Uploading file to server',
    'Validating file format',
    'Normalizing units & coordinates',
    'Storing in unified repository',
  ];

  const supportedFormats = [
    { ext: 'CSV', desc: 'Comma-separated values' },
    { ext: 'JSON', desc: 'JavaScript Object Notation' },
    { ext: 'FITS', desc: 'Flexible Image Transport System' },
    { ext: 'VOTable', desc: 'Virtual Observatory Table' },
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setProcessingStep(-1);
    setUploadProgress(0);
    setRawDatasetId(null);
    setNormalizedDatasetId(null);
    setShowAnalyticsButton(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1: Upload the file
  const uploadFile = async () => {
    if (!selectedFile || !selectedSource) {
      setError('Please select a file and data source');
      return null;
    }

    setProcessingStep(0);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('source_id', selectedSource);

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('You must be logged in to upload files');
      return null;
    }

    try {
      const response = await fetch('http://localhost:5000/ingestion/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired or invalid. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      setRawDatasetId(data.dataset_id);
      setUploadProgress(100);
      return data.dataset_id;
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      return null;
    }
  };

  // Step 2: Trigger normalization
  const triggerNormalization = async (datasetId) => {
    setProcessingStep(1);
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('You must be logged in to normalize datasets');
      return null;
    }

    try {
      const response = await fetch(`http://localhost:5000/ingestion/normalize/${datasetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired or invalid. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Normalization failed');
      }

      const data = await response.json();
      console.log('Normalization response:', data);
      
      setNormalizedDatasetId(data.normalized_dataset_id);
      setProcessingStep(2);
      setProcessingStep(3); // Complete
      setShowAnalyticsButton(true); // ✅ Enable analytics button
      
    } catch (err) {
      console.error('Normalization error:', err);
      setError(err.message || 'Normalization failed. Please try again.');
      return null;
    }
  };

  const startIngestion = async () => {
    if (!selectedFile || !selectedSource) {
      setError('Please select a file and data source');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStep(0);
    setUploadProgress(0);

    try {
      // Step 1: Upload file
      const datasetId = await uploadFile();
      if (!datasetId) throw new Error('Upload failed');
      
      // Step 2: Trigger normalization
      await triggerNormalization(datasetId);
      
      setIsProcessing(false);
      
      // Optional: Show success message
      setPreviewData({
        totalRows: 100,
        message: "Dataset uploaded and normalized successfully!"
      });
      
    } catch (err) {
      console.error('Ingestion error:', err);
      setError(err.message || 'Ingestion failed');
      setIsProcessing(false);
      setProcessingStep(-1);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToAnalytics = () => {
    if (normalizedDatasetId) {
      navigate(`/analytics?dataset=${normalizedDatasetId}`);
    }
  };

  // Check if button should be enabled
  const isButtonEnabled = selectedFile && selectedSource && !isProcessing;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Astronomical Data</h1>
        <p className="text-muted-foreground mt-1">
          Ingest and normalize data from various space agencies and observatories
        </p>
      </div>

      {/* Main upload area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="glass rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Select File
          </h3>

          {/* Drop zone */}
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${selectedFile 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.fits,.vot,.xml"
              onChange={handleFileDrop}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="inline-flex items-center gap-1 text-sm text-destructive hover:text-destructive/80"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
              </div>
            )}
          </div>

          {/* Supported formats */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Supported formats:</p>
            <div className="flex flex-wrap gap-2">
              {supportedFormats.map((format) => (
                <span
                  key={format.ext}
                  className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground"
                  title={format.desc}
                >
                  .{format.ext.toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Source Selection */}
        <div className="glass rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            Select Data Source
          </h3>

          {loadingSources ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  onClick={() => {
                    console.log('Setting source to:', source.id);
                    setSelectedSource(source.id);
                  }}
                  className={`
                    p-4 rounded-xl border text-left transition-all cursor-pointer
                    ${selectedSource === source.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }
                  `}
                >
                  <span className="text-2xl">{source.icon || '📡'}</span>
                  <p className="font-medium text-foreground mt-2">{source.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/50">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Processing Status */}
      {(isProcessing || processingStep >= 0) && (
        <div className="glass rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            Processing Status
          </h3>

          {/* Progress bar for upload */}
          {processingStep === 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="text-foreground font-mono">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Processing steps */}
          {uploadProgress === 100 && (
            <DataProcessingLoader steps={processingSteps} currentStep={processingStep} />
          )}

          {/* Completion */}
          {processingStep >= processingSteps.length - 1 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-foreground">Processing Complete!</p>
                <p className="text-sm text-muted-foreground">
                  Your data has been normalized and stored successfully.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Preview */}
      {previewData && previewData.message && (
        <div className="glass rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Upload Successful
            </h3>
          </div>
          <p className="text-foreground">{previewData.message}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        {processingStep >= processingSteps.length - 1 ? (
          <div className="flex gap-4">
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all"
            >
              <ArrowRight className="w-5 h-5" />
              Go to Dashboard
            </button>
            {showAnalyticsButton && normalizedDatasetId && (
              <button
                onClick={goToAnalytics}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-secondary transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                Go to Analytics
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={removeFile}
              disabled={isProcessing}
              className="px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={startIngestion}
              disabled={!isButtonEnabled}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${isButtonEnabled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Start Ingestion
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadData;
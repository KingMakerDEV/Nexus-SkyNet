import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { DataProcessingLoader } from '../components/common/Loader';
import CoordinateViewer from '../components/visualization/CoordinateViewer';

const UploadData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSource, setSelectedSource] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const sources = [
    { id: 'nasa', name: 'NASA', icon: '🚀', description: 'NASA Exoplanet Archive, MAST, etc.' },
    { id: 'esa', name: 'ESA', icon: '🛸', description: 'Gaia, XMM-Newton, Herschel data' },
    { id: 'observatory', name: 'Observatory', icon: '🔭', description: 'Ground-based observations' },
    { id: 'other', name: 'Other', icon: '📡', description: 'Custom or third-party sources' },
  ];

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = async () => {
    if (!selectedFile || !selectedSource) {
      setError('Please select a file and data source');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // Simulate processing steps
    for (let step = 0; step < processingSteps.length; step++) {
      setProcessingStep(step);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Simulate preview data
    setPreviewData({
      totalRows: 15847,
      columns: ['object_id', 'ra', 'dec', 'magnitude', 'distance', 'spectral_type'],
      normalizedUnits: {
        ra: 'degrees (ICRS)',
        dec: 'degrees (ICRS)',
        distance: 'parsecs',
        magnitude: 'apparent (V-band)',
      },
      sampleConversion: {
        original: { ra: 83.822, dec: -5.391, epoch: 'J2015.5' },
        normalized: { ra: 83.82208, dec: -5.39095, epoch: 'J2000.0' },
      },
    });

    setProcessingStep(processingSteps.length);
    setIsProcessing(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

          <div className="grid grid-cols-2 gap-3">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`
                  p-4 rounded-xl border text-left transition-all
                  ${selectedSource === source.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                <span className="text-2xl">{source.icon}</span>
                <p className="font-medium text-foreground mt-2">{source.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
              </button>
            ))}
          </div>
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

          {/* Progress bar */}
          {uploadProgress < 100 && (
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
          {processingStep >= processingSteps.length && (
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

      {/* Normalization Preview */}
      {previewData && (
        <div className="glass rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Normalization Preview
            </h3>
            <span className="text-sm text-muted-foreground">
              {previewData.totalRows.toLocaleString()} rows processed
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Total Rows</p>
              <p className="text-lg font-bold text-foreground">{previewData.totalRows.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Columns</p>
              <p className="text-lg font-bold text-foreground">{previewData.columns.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Coordinate System</p>
              <p className="text-lg font-bold text-primary">ICRS</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Epoch</p>
              <p className="text-lg font-bold text-foreground">J2000.0</p>
            </div>
          </div>

          {/* Coordinate conversion preview */}
          <CoordinateViewer
            originalCoords={previewData.sampleConversion.original}
            normalizedCoords={previewData.sampleConversion.normalized}
            coordinateSystem="ICRS"
          />

          {/* Normalized units */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Normalized Units</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(previewData.normalizedUnits).map(([field, unit]) => (
                <div key={field} className="p-3 rounded-lg bg-muted/20 border border-border">
                  <p className="text-xs text-muted-foreground capitalize">{field}</p>
                  <p className="text-sm text-foreground font-medium">{unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={removeFile}
          className="px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={simulateUpload}
          disabled={!selectedFile || !selectedSource || isProcessing}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
            ${!selectedFile || !selectedSource || isProcessing
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary'
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
      </div>
    </div>
  );
};

export default UploadData;

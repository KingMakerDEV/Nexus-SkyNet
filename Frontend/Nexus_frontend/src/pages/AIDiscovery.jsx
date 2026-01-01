import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  Zap,
  AlertTriangle,
  TrendingUp,
  Search,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Star,
  Activity,
} from 'lucide-react';

const AIDiscovery = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedDatasets, setSelectedDatasets] = useState([]);

  const datasets = [
    { id: 1, name: 'Gaia DR3 Star Catalog', selected: true },
    { id: 2, name: 'Hubble Deep Field', selected: false },
    { id: 3, name: 'JWST Exoplanet Atmospheres', selected: true },
    { id: 4, name: 'Chandra X-ray Catalog', selected: false },
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  // Sample AI insights
  const anomalies = [
    {
      id: 1,
      severity: 'high',
      title: 'Unusual Stellar Velocity Cluster',
      description: 'Detected a group of 47 stars with anomalously high proper motion (>500 mas/yr) in the Gaia catalog, potentially indicating a disrupted stellar stream.',
      coordinates: 'RA: 145.23°, Dec: +28.45°',
      confidence: 94.2,
    },
    {
      id: 2,
      severity: 'medium',
      title: 'Spectral Anomaly in Exoplanet Data',
      description: 'JWST spectra of WASP-39b shows unexpected absorption features at 4.2μm, possibly indicating novel atmospheric chemistry.',
      coordinates: 'RA: 217.89°, Dec: -3.12°',
      confidence: 87.5,
    },
    {
      id: 3,
      severity: 'low',
      title: 'Magnitude Discrepancy',
      description: 'Cross-match reveals systematic 0.3 mag offset between Gaia G-band and Hubble F606W for red giant stars.',
      coordinates: 'Multiple sources',
      confidence: 91.8,
    },
  ];

  const patterns = [
    {
      id: 1,
      title: 'Galactic Spiral Arm Correlation',
      description: 'Strong correlation between stellar age and distance from spiral arm center, consistent with density wave theory.',
      datasets: ['Gaia DR3'],
      significance: 'High',
    },
    {
      id: 2,
      title: 'Exoplanet Radius Valley',
      description: 'Confirmed bimodal distribution of exoplanet radii at 1.5-2.0 Earth radii, supporting photoevaporation models.',
      datasets: ['JWST Exoplanets', 'Kepler Archive'],
      significance: 'High',
    },
    {
      id: 3,
      title: 'X-ray Binary Period Clustering',
      description: 'Detected clustering of orbital periods around 4.8 hours for low-mass X-ray binaries.',
      datasets: ['Chandra X-ray'],
      significance: 'Medium',
    },
  ];

  const recommendations = [
    {
      icon: Search,
      title: 'Cross-match with SDSS',
      description: 'The detected stellar stream could benefit from spectroscopic follow-up using SDSS data.',
    },
    {
      icon: Activity,
      title: 'Time-series Analysis',
      description: 'Apply periodogram analysis to the velocity outliers to detect potential binary companions.',
    },
    {
      icon: Lightbulb,
      title: 'Extend JWST Observation',
      description: 'The unusual spectral feature warrants additional observation time for confirmation.',
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-secondary" />
            AI Discovery Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Machine learning-powered insights from your astronomical data
          </p>
        </div>
      </div>

      {/* Analysis trigger */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Run AI Analysis
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI will analyze your normalized datasets to detect anomalies,
              discover patterns, and generate actionable insights.
            </p>
            <div className="flex flex-wrap gap-2">
              {datasets.map((ds) => (
                <label
                  key={ds.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                    ds.selected
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={ds.selected}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      ds.selected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}
                  >
                    {ds.selected && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                  </div>
                  <span className="text-sm">{ds.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all ${
              isAnalyzing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-to-r from-secondary to-primary text-white hover:opacity-90 glow-secondary'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-6 h-6 animate-pulse" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                <span>Run AI Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis progress */}
        {isAnalyzing && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-secondary to-primary rounded-full data-flow" />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Analyzing patterns...</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['Loading data', 'Detecting anomalies', 'Finding patterns', 'Generating insights'].map(
                (step, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-lg ${
                      index < 2
                        ? 'bg-primary/10 text-primary'
                        : index === 2
                        ? 'bg-secondary/10 text-secondary animate-pulse'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-xs font-medium">{step}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {analysisComplete && (
        <div className="space-y-6 animate-slide-in">
          {/* Anomalies */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground">Detected Anomalies</h3>
              </div>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-sm">
                {anomalies.length} found
              </span>
            </div>
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(
                            anomaly.severity
                          )}`}
                        >
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <h4 className="font-semibold text-foreground">{anomaly.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{anomaly.coordinates}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {anomaly.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patterns */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Discovered Patterns</h3>
              </div>
              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-sm">
                {patterns.length} patterns
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <h4 className="font-semibold text-foreground mb-2">{pattern.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{pattern.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {pattern.datasets.map((ds, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground"
                        >
                          {ds}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        pattern.significance === 'High' ? 'text-green-500' : 'text-amber-500'
                      }`}
                    >
                      {pattern.significance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => {
                const Icon = rec.icon;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 hover:border-accent/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <h4 className="font-medium text-foreground">{rec.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Explanation */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-foreground">AI Analysis Summary</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The analysis of <span className="text-foreground font-medium">2 datasets</span> containing{' '}
                <span className="text-foreground font-medium">2.8 million objects</span> revealed several
                significant findings. The most notable discovery is a potential stellar stream in the Gaia
                data, characterized by 47 stars with unusually high proper motion. This kinematic signature
                suggests these stars may have originated from a disrupted dwarf galaxy. Additionally, the
                cross-correlation between JWST spectroscopic data and theoretical models indicates possible
                novel atmospheric chemistry in WASP-39b. Further investigation is recommended to confirm
                these preliminary findings.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Re-run Analysis
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!analysisComplete && !isAnalyzing && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Ready to Discover
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Select datasets and run the AI analysis to uncover hidden patterns,
            detect anomalies, and generate scientific insights from your normalized data.
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">15M+</p>
              <p className="text-xs text-muted-foreground">Objects Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">1,247</p>
              <p className="text-xs text-muted-foreground">Anomalies Found</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">98.5%</p>
              <p className="text-xs text-muted-foreground">Accuracy Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDiscovery;

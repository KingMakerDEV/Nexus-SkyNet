import React, { useState } from 'react';
import {
  GitCompare,
  ChevronDown,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import ComparisonChart from '../components/charts/ComparisonChart';

const CompareDatasets = () => {
  const [datasetA, setDatasetA] = useState('');
  const [datasetB, setDatasetB] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const datasets = [
    { id: 'gaia-dr3', name: 'Gaia DR3 Star Catalog', source: 'ESA', objects: 2847562 },
    { id: 'hubble-deep', name: 'Hubble Deep Field', source: 'NASA', objects: 15847 },
    { id: 'jwst-exo', name: 'JWST Exoplanet Atmospheres', source: 'NASA', objects: 342 },
    { id: 'chandra-xray', name: 'Chandra X-ray Catalog', source: 'NASA', objects: 892451 },
    { id: 'gaia-dr2', name: 'Gaia DR2 Star Catalog', source: 'ESA', objects: 1692919 },
  ];

  const swapDatasets = () => {
    const temp = datasetA;
    setDatasetA(datasetB);
    setDatasetB(temp);
  };

  const runComparison = async () => {
    if (!datasetA || !datasetB) return;

    setIsComparing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Sample comparison result
    setComparisonResult({
      summary: {
        matchingObjects: 1245892,
        uniqueToA: 1601670,
        uniqueToB: 447027,
        totalOverlap: 43.7,
      },
      differences: [
        {
          field: 'Right Ascension',
          avgDifference: 0.00023,
          maxDifference: 0.0015,
          unit: 'degrees',
          status: 'compatible',
        },
        {
          field: 'Declination',
          avgDifference: 0.00018,
          maxDifference: 0.0012,
          unit: 'degrees',
          status: 'compatible',
        },
        {
          field: 'Proper Motion RA',
          avgDifference: 0.42,
          maxDifference: 2.8,
          unit: 'mas/yr',
          status: 'warning',
        },
        {
          field: 'Magnitude',
          avgDifference: 0.05,
          maxDifference: 0.3,
          unit: 'mag',
          status: 'compatible',
        },
        {
          field: 'Parallax',
          avgDifference: 0.08,
          maxDifference: 0.5,
          unit: 'mas',
          status: 'compatible',
        },
      ],
      chartData: [
        { bin: '0-30°', valueA: 245000, valueB: 198000 },
        { bin: '30-60°', valueA: 312000, valueB: 287000 },
        { bin: '60-90°', valueA: 428000, valueB: 395000 },
        { bin: '90-120°', valueA: 389000, valueB: 412000 },
        { bin: '120-150°', valueA: 298000, valueB: 276000 },
        { bin: '150-180°', valueA: 175000, valueB: 124000 },
      ],
    });

    setIsComparing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <Info className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const selectedA = datasets.find((d) => d.id === datasetA);
  const selectedB = datasets.find((d) => d.id === datasetB);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compare Datasets</h1>
        <p className="text-muted-foreground mt-1">
          Analyze differences between normalized astronomical datasets
        </p>
      </div>

      {/* Dataset Selection */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Dataset A */}
          <div className="flex-1 w-full">
            <label className="text-sm text-muted-foreground mb-2 block">Dataset A</label>
            <div className="relative">
              <select
                value={datasetA}
                onChange={(e) => setDatasetA(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="">Select dataset...</option>
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id} disabled={dataset.id === datasetB}>
                    {dataset.name} ({dataset.source})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {selectedA && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedA.objects.toLocaleString()} objects
              </p>
            )}
          </div>

          {/* Swap button */}
          <button
            onClick={swapDatasets}
            disabled={!datasetA || !datasetB}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-all lg:mt-6"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          {/* Dataset B */}
          <div className="flex-1 w-full">
            <label className="text-sm text-muted-foreground mb-2 block">Dataset B</label>
            <div className="relative">
              <select
                value={datasetB}
                onChange={(e) => setDatasetB(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="">Select dataset...</option>
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id} disabled={dataset.id === datasetA}>
                    {dataset.name} ({dataset.source})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {selectedB && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedB.objects.toLocaleString()} objects
              </p>
            )}
          </div>

          {/* Compare button */}
          <button
            onClick={runComparison}
            disabled={!datasetA || !datasetB || isComparing}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all lg:mt-6 ${
              !datasetA || !datasetB || isComparing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 glow-primary'
            }`}
          >
            {isComparing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                Compare
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6 animate-slide-in">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-5">
              <p className="text-sm text-muted-foreground">Matching Objects</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {comparisonResult.summary.matchingObjects.toLocaleString()}
              </p>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-sm text-muted-foreground">Unique to Dataset A</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {comparisonResult.summary.uniqueToA.toLocaleString()}
              </p>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-sm text-muted-foreground">Unique to Dataset B</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {comparisonResult.summary.uniqueToB.toLocaleString()}
              </p>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-sm text-muted-foreground">Overlap Percentage</p>
              <p className="text-2xl font-bold text-accent mt-1">
                {comparisonResult.summary.totalOverlap}%
              </p>
            </div>
          </div>

          {/* Comparison chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Object Distribution Comparison
            </h3>
            <ComparisonChart
              data={comparisonResult.chartData}
              xKey="bin"
              datasetA={{
                dataKey: 'valueA',
                name: selectedA?.name || 'Dataset A',
                color: 'hsl(200, 100%, 60%)',
              }}
              datasetB={{
                dataKey: 'valueB',
                name: selectedB?.name || 'Dataset B',
                color: 'hsl(270, 80%, 60%)',
              }}
              height={350}
            />
          </div>

          {/* Difference table */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Field-by-Field Differences
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Field
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Avg Difference
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Max Difference
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Unit
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonResult.differences.map((diff, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-foreground">
                        {diff.field}
                      </td>
                      <td className="py-4 px-4 text-sm text-right font-mono text-foreground">
                        {diff.avgDifference}
                      </td>
                      <td className="py-4 px-4 text-sm text-right font-mono text-foreground">
                        {diff.maxDifference}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-muted-foreground">
                        {diff.unit}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(diff.status)}
                          <span className={`text-sm capitalize ${
                            diff.status === 'compatible' ? 'text-green-500' :
                            diff.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {diff.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compatibility note */}
          <div className="glass rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Comparison Notes</p>
              <p className="text-sm text-muted-foreground mt-1">
                Both datasets have been normalized to ICRS J2000.0 coordinates before comparison.
                Differences in proper motion may indicate different observation epochs in the original data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!comparisonResult && !isComparing && (
        <div className="glass rounded-xl p-12 text-center">
          <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Select Datasets to Compare
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose two normalized datasets from the dropdowns above to analyze their differences
            and find matching objects across data sources.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareDatasets;

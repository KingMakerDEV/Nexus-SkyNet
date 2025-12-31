import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ChevronDown,
  Calendar,
  Database,
  Star,
  Globe,
  Layers,
  X,
  Info,
} from 'lucide-react';
import Modal, { MetadataModal } from '../components/common/Modal';

const DatasetExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    source: '',
    objectType: '',
    coordinateSystem: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  // Sample datasets
  const datasets = [
    {
      id: 1,
      name: 'Gaia DR3 Star Catalog - Sector 7',
      source: 'ESA',
      objectType: 'Star',
      objects: 2847562,
      size: '1.2 GB',
      coordinateSystem: 'ICRS',
      uploadDate: '2024-01-15',
      status: 'normalized',
      metadata: {
        mission: 'Gaia',
        release: 'DR3',
        epoch: 'J2016.0',
        spectralTypes: 'A, F, G, K, M',
        magnitudeRange: '3.0 - 21.0',
        processingDate: '2024-01-15T10:30:00Z',
      },
    },
    {
      id: 2,
      name: 'Hubble Deep Field Observations',
      source: 'NASA',
      objectType: 'Galaxy',
      objects: 15847,
      size: '458 MB',
      coordinateSystem: 'ICRS',
      uploadDate: '2024-01-12',
      status: 'normalized',
      metadata: {
        instrument: 'WFC3',
        filter: 'F160W',
        exposure: '2400s',
        field: 'HUDF',
      },
    },
    {
      id: 3,
      name: 'JWST Exoplanet Atmospheres',
      source: 'NASA',
      objectType: 'Planet',
      objects: 342,
      size: '89 MB',
      coordinateSystem: 'ICRS',
      uploadDate: '2024-01-10',
      status: 'normalized',
      metadata: {
        instrument: 'NIRSpec',
        mode: 'Transit Spectroscopy',
        wavelength: '0.6-5.3 μm',
      },
    },
    {
      id: 4,
      name: 'Messier Catalog Objects',
      source: 'Observatory',
      objectType: 'Mixed',
      objects: 110,
      size: '12 MB',
      coordinateSystem: 'ICRS',
      uploadDate: '2024-01-08',
      status: 'normalized',
      metadata: {
        catalog: 'Messier',
        types: 'Galaxies, Nebulae, Clusters',
        completeness: '100%',
      },
    },
    {
      id: 5,
      name: 'Chandra X-ray Source Catalog',
      source: 'NASA',
      objectType: 'Quasar',
      objects: 892451,
      size: '2.8 GB',
      coordinateSystem: 'ICRS',
      uploadDate: '2024-01-05',
      status: 'normalized',
      metadata: {
        mission: 'Chandra',
        energyBand: '0.3-10 keV',
        exposure: 'Variable',
      },
    },
    {
      id: 6,
      name: 'Near-Earth Asteroid Observations',
      source: 'Observatory',
      objectType: 'Asteroid',
      objects: 28456,
      size: '156 MB',
      coordinateSystem: 'Ecliptic',
      uploadDate: '2024-01-03',
      status: 'pending',
      metadata: {
        observatory: 'Multiple',
        orbitType: 'NEO',
        hazardous: '2341 PHAs',
      },
    },
  ];

  const sources = ['NASA', 'ESA', 'Observatory', 'Hubble', 'JWST', 'Gaia'];
  const objectTypes = ['Star', 'Galaxy', 'Nebula', 'Planet', 'Asteroid', 'Quasar', 'Mixed'];
  const coordinateSystems = ['ICRS', 'Galactic', 'Ecliptic', 'Equatorial'];

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = !filters.source || dataset.source === filters.source;
    const matchesType = !filters.objectType || dataset.objectType === filters.objectType;
    const matchesCoord = !filters.coordinateSystem || dataset.coordinateSystem === filters.coordinateSystem;
    return matchesSearch && matchesSource && matchesType && matchesCoord;
  });

  const clearFilters = () => {
    setFilters({
      source: '',
      objectType: '',
      coordinateSystem: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const sourceColors = {
    NASA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ESA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Observatory: 'bg-green-500/20 text-green-400 border-green-500/30',
    Hubble: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    JWST: 'bg-red-500/20 text-red-400 border-red-500/30',
    Gaia: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dataset Explorer</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage normalized astronomical datasets
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="w-4 h-4" />
          <span>{filteredDatasets.length} datasets</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets by name, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-xs">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border animate-slide-in">
            {/* Source filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Source</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">All Sources</option>
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Object type filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Object Type</label>
              <select
                value={filters.objectType}
                onChange={(e) => setFilters({ ...filters, objectType: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">All Types</option>
                {objectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Coordinate system filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Coordinate System</label>
              <select
                value={filters.coordinateSystem}
                onChange={(e) => setFilters({ ...filters, coordinateSystem: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">All Systems</option>
                {coordinateSystems.map((system) => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dataset list */}
      <div className="space-y-3">
        {filteredDatasets.map((dataset) => (
          <div
            key={dataset.id}
            className="glass-hover rounded-xl p-5 transition-all hover-lift"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{dataset.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${sourceColors[dataset.source] || 'bg-muted text-muted-foreground'}`}>
                        {dataset.source}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                        {dataset.objectType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                        {dataset.coordinateSystem}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Objects</p>
                  <p className="font-mono font-medium text-foreground">{formatNumber(dataset.objects)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-mono font-medium text-foreground">{dataset.size}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{dataset.uploadDate}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDataset(dataset);
                    setShowMetadataModal(true);
                  }}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="View metadata"
                >
                  <Info className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Preview data"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDatasets.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No datasets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Metadata Modal */}
      <MetadataModal
        isOpen={showMetadataModal}
        onClose={() => setShowMetadataModal(false)}
        title={selectedDataset?.name}
        metadata={selectedDataset?.metadata}
      />
    </div>
  );
};

export default DatasetExplorer;

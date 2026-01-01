// Data source configurations
export const DATA_SOURCES = [
  { id: 'nasa', name: 'NASA', color: '#3B82F6', icon: '🚀' },
  { id: 'esa', name: 'ESA', color: '#8B5CF6', icon: '🛸' },
  { id: 'observatory', name: 'Observatory', color: '#10B981', icon: '🔭' },
  { id: 'hubble', name: 'Hubble', color: '#F59E0B', icon: '🌌' },
  { id: 'jwst', name: 'JWST', color: '#EF4444', icon: '✨' },
  { id: 'gaia', name: 'Gaia', color: '#EC4899', icon: '⭐' },
];

// Coordinate systems
export const COORDINATE_SYSTEMS = [
  { id: 'icrs', name: 'ICRS', description: 'International Celestial Reference System' },
  { id: 'galactic', name: 'Galactic', description: 'Galactic Coordinate System' },
  { id: 'ecliptic', name: 'Ecliptic', description: 'Ecliptic Coordinate System' },
  { id: 'equatorial', name: 'Equatorial', description: 'Equatorial J2000.0' },
];

// Object types
export const OBJECT_TYPES = [
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'galaxy', name: 'Galaxy', icon: '🌌' },
  { id: 'nebula', name: 'Nebula', icon: '☁️' },
  { id: 'cluster', name: 'Cluster', icon: '✨' },
  { id: 'planet', name: 'Planet', icon: '🪐' },
  { id: 'asteroid', name: 'Asteroid', icon: '☄️' },
  { id: 'comet', name: 'Comet', icon: '💫' },
  { id: 'quasar', name: 'Quasar', icon: '💠' },
  { id: 'pulsar', name: 'Pulsar', icon: '🔘' },
  { id: 'blackhole', name: 'Black Hole', icon: '⚫' },
];

// File formats supported
export const SUPPORTED_FORMATS = [
  { extension: '.csv', name: 'CSV', mimeType: 'text/csv' },
  { extension: '.json', name: 'JSON', mimeType: 'application/json' },
  { extension: '.fits', name: 'FITS', mimeType: 'application/fits' },
  { extension: '.vot', name: 'VOTable', mimeType: 'application/x-votable+xml' },
];

// Ingestion status types
export const INGESTION_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  NORMALIZING: 'normalizing',
  VALIDATING: 'validating',
  STORING: 'storing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Status colors
export const STATUS_COLORS = {
  pending: '#6B7280',
  uploading: '#3B82F6',
  normalizing: '#8B5CF6',
  validating: '#F59E0B',
  storing: '#10B981',
  completed: '#22C55E',
  failed: '#EF4444',
};

// Chart colors
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

// API endpoints
export const API_ENDPOINTS = {
  INGESTION: '/ingestion',
  DATASETS: '/datasets',
  ANALYTICS: '/analytics',
  AI: '/ai',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Time range options for analytics
export const TIME_RANGES = [
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'all', label: 'All Time' },
];

// Unit conversions commonly used in astronomy
export const UNIT_CONVERSIONS = {
  parsecToLightYear: 3.26156,
  auToKm: 149597870.7,
  solarMassToKg: 1.989e30,
  arcSecToRad: 4.84814e-6,
};

// Map configuration
export const SKY_MAP_CONFIG = {
  defaultCenter: { ra: 180, dec: 0 },
  defaultZoom: 1,
  minZoom: 0.5,
  maxZoom: 10,
  markerSizes: {
    small: 4,
    medium: 8,
    large: 12,
  },
};

/**
 * Format a number with proper astronomical notation
 * @param {number} num - The number to format
 * @param {number} precision - Decimal precision
 * @returns {string} - Formatted number
 */
export const formatAstronomicalNumber = (num, precision = 4) => {
  if (num === null || num === undefined) return 'N/A';
  
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 1e-4 && num !== 0)) {
    return num.toExponential(precision);
  }
  
  return num.toFixed(precision);
};

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Date(date).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Format coordinates (RA/Dec)
 * @param {number} ra - Right Ascension in degrees
 * @param {number} dec - Declination in degrees
 * @returns {string} - Formatted coordinate string
 */
export const formatCoordinates = (ra, dec) => {
  if (ra === null || dec === null) return 'N/A';
  
  // Convert RA to hours, minutes, seconds
  const raHours = ra / 15;
  const raH = Math.floor(raHours);
  const raM = Math.floor((raHours - raH) * 60);
  const raS = ((raHours - raH) * 60 - raM) * 60;
  
  // Convert Dec to degrees, arcminutes, arcseconds
  const decSign = dec >= 0 ? '+' : '-';
  const decAbs = Math.abs(dec);
  const decD = Math.floor(decAbs);
  const decM = Math.floor((decAbs - decD) * 60);
  const decS = ((decAbs - decD) * 60 - decM) * 60;
  
  return `${raH}h ${raM}m ${raS.toFixed(2)}s, ${decSign}${decD}° ${decM}' ${decS.toFixed(1)}"`;
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format large numbers with abbreviations
 * @param {number} num - Number to format
 * @returns {string} - Formatted number with abbreviation
 */
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  
  return num.toString();
};

/**
 * Format duration in milliseconds to human readable
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - Human readable duration
 */
export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
export const truncateString = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Format source name to display name
 * @param {string} source - Source identifier
 * @returns {string} - Display name
 */
export const formatSourceName = (source) => {
  const sourceMap = {
    nasa: 'NASA',
    esa: 'ESA',
    observatory: 'Observatory',
    hubble: 'Hubble Space Telescope',
    jwst: 'James Webb Space Telescope',
    gaia: 'Gaia Mission',
    chandra: 'Chandra X-ray Observatory',
  };
  
  return sourceMap[source?.toLowerCase()] || source || 'Unknown';
};

import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

const CoordinateViewer = ({
  originalCoords = {},
  normalizedCoords = {},
  coordinateSystem = 'ICRS',
  showConversion = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(null);

  const formatCoord = (value, precision = 6) => {
    if (value === undefined || value === null) return 'N/A';
    return typeof value === 'number' ? value.toFixed(precision) : value;
  };

  const formatRA = (degrees) => {
    if (degrees === undefined || degrees === null) return 'N/A';
    const hours = degrees / 15;
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = ((hours - h) * 60 - m) * 60;
    return `${h}h ${m}m ${s.toFixed(2)}s`;
  };

  const formatDec = (degrees) => {
    if (degrees === undefined || degrees === null) return 'N/A';
    const sign = degrees >= 0 ? '+' : '-';
    const abs = Math.abs(degrees);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d) * 60 - m) * 60;
    return `${sign}${d}° ${m}' ${s.toFixed(1)}"`;
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const CoordCard = ({ title, coords, type, color }) => (
    <div className={`flex-1 p-4 rounded-xl border ${color} bg-card/50`}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>
      <div className="space-y-3">
        {/* Right Ascension */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Right Ascension</span>
            <button
              onClick={() => copyToClipboard(formatCoord(coords.ra), `${type}-ra`)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              {copied === `${type}-ra` ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="font-mono text-foreground">{formatRA(coords.ra)}</div>
          <div className="text-xs text-muted-foreground">({formatCoord(coords.ra)}°)</div>
        </div>

        {/* Declination */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Declination</span>
            <button
              onClick={() => copyToClipboard(formatCoord(coords.dec), `${type}-dec`)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              {copied === `${type}-dec` ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="font-mono text-foreground">{formatDec(coords.dec)}</div>
          <div className="text-xs text-muted-foreground">({formatCoord(coords.dec)}°)</div>
        </div>

        {/* Additional fields */}
        {coords.distance && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Distance</span>
            <div className="font-mono text-foreground">{formatCoord(coords.distance, 2)} pc</div>
          </div>
        )}

        {coords.epoch && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Epoch</span>
            <div className="font-mono text-foreground">{coords.epoch}</div>
          </div>
        )}
      </div>
    </div>
  );

  // Calculate differences
  const raDiff = normalizedCoords.ra !== undefined && originalCoords.ra !== undefined
    ? (normalizedCoords.ra - originalCoords.ra).toFixed(6)
    : null;
  const decDiff = normalizedCoords.dec !== undefined && originalCoords.dec !== undefined
    ? (normalizedCoords.dec - originalCoords.dec).toFixed(6)
    : null;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Coordinate system badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Coordinate System:</span>
          <span className="px-2 py-1 rounded bg-primary/20 text-primary text-sm font-medium">
            {coordinateSystem}
          </span>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinate comparison */}
      {showConversion ? (
        <div className="flex items-stretch gap-4">
          <CoordCard
            title="Original Coordinates"
            coords={originalCoords}
            type="original"
            color="border-muted"
          />
          
          {/* Arrow */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            <div className="h-full w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50 my-2" />
            <span className="text-[10px] text-muted-foreground text-center">
              Normalized
            </span>
          </div>

          <CoordCard
            title="Normalized (ICRS J2000)"
            coords={normalizedCoords}
            type="normalized"
            color="border-primary/50"
          />
        </div>
      ) : (
        <CoordCard
          title="Coordinates"
          coords={normalizedCoords}
          type="single"
          color="border-border"
        />
      )}

      {/* Difference summary */}
      {showConversion && (raDiff !== null || decDiff !== null) && (
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <h5 className="text-xs font-medium text-muted-foreground mb-2">
            Normalization Difference
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ΔRA:</span>
              <span className={`font-mono ${parseFloat(raDiff) !== 0 ? 'text-primary' : 'text-foreground'}`}>
                {raDiff !== null ? `${parseFloat(raDiff) > 0 ? '+' : ''}${raDiff}°` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ΔDec:</span>
              <span className={`font-mono ${parseFloat(decDiff) !== 0 ? 'text-primary' : 'text-foreground'}`}>
                {decDiff !== null ? `${parseFloat(decDiff) > 0 ? '+' : ''}${decDiff}°` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinateViewer;

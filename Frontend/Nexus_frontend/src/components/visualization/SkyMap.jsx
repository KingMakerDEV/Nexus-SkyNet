import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';

// Interactive Sky Fusion Map component
const SkyMap = ({
  objects = [],
  width = 800,
  height = 500,
  onObjectClick,
  showNormalized = true,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredObject, setHoveredObject] = useState(null);
  const [activeSources, setActiveSources] = useState(['nasa', 'esa', 'observatory']);
  const [viewMode, setViewMode] = useState('normalized'); // 'normalized' or 'raw'

  // Source colors
  const sourceColors = {
    nasa: '#3B82F6',
    esa: '#8B5CF6',
    observatory: '#10B981',
    hubble: '#F59E0B',
    jwst: '#EF4444',
    gaia: '#EC4899',
  };

  // Convert RA/Dec to canvas coordinates
  const raDecToCanvas = useCallback((ra, dec) => {
    const x = ((ra / 360) * width * zoom) + offset.x + width / 2;
    const y = ((-dec / 180 + 0.5) * height * zoom) + offset.y + height / 2;
    return { x, y };
  }, [width, height, zoom, offset]);

  // Draw the sky map
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const bgGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    bgGradient.addColorStop(0, 'hsl(250, 30%, 8%)');
    bgGradient.addColorStop(1, 'hsl(230, 25%, 5%)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars background
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      const opacity = Math.random() * 0.5 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Draw coordinate grid
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.15)';
    ctx.lineWidth = 1;

    // RA lines (vertical)
    for (let ra = 0; ra <= 360; ra += 30) {
      const { x } = raDecToCanvas(ra, 0);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Dec lines (horizontal)
    for (let dec = -90; dec <= 90; dec += 30) {
      const { y } = raDecToCanvas(0, dec);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw celestial equator
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    const eqY = raDecToCanvas(0, 0).y;
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(width, eqY);
    ctx.stroke();

    // Draw objects
    const filteredObjects = objects.filter(obj => 
      activeSources.includes(obj.source?.toLowerCase())
    );

    filteredObjects.forEach(obj => {
      const ra = viewMode === 'normalized' ? obj.ra_normalized : obj.ra_raw;
      const dec = viewMode === 'normalized' ? obj.dec_normalized : obj.dec_raw;
      
      if (ra === undefined || dec === undefined) return;

      const { x, y } = raDecToCanvas(ra, dec);

      // Check if in viewport
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) return;

      const color = sourceColors[obj.source?.toLowerCase()] || '#ffffff';
      const size = (obj.magnitude ? Math.max(3, 10 - obj.magnitude) : 5) * zoom;
      const isHovered = hoveredObject?.id === obj.id;

      // Draw glow effect
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      glowGradient.addColorStop(0, color + '40');
      glowGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw object
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#ffffff' : color;
      ctx.fill();

      if (isHovered) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw axis labels
    ctx.fillStyle = 'rgba(150, 170, 200, 0.6)';
    ctx.font = '10px Space Grotesk';
    ctx.textAlign = 'center';

    for (let ra = 0; ra <= 360; ra += 60) {
      const { x } = raDecToCanvas(ra, 0);
      ctx.fillText(`${ra}°`, x, height - 5);
    }

    ctx.textAlign = 'right';
    for (let dec = -60; dec <= 60; dec += 30) {
      const { y } = raDecToCanvas(0, dec);
      ctx.fillText(`${dec}°`, 25, y + 4);
    }

  }, [objects, width, height, zoom, offset, activeSources, hoveredObject, viewMode, raDecToCanvas, sourceColors]);

  // Handle mouse events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Check for object hover
      const filteredObjects = objects.filter(obj => 
        activeSources.includes(obj.source?.toLowerCase())
      );

      let found = null;
      for (const obj of filteredObjects) {
        const ra = viewMode === 'normalized' ? obj.ra_normalized : obj.ra_raw;
        const dec = viewMode === 'normalized' ? obj.dec_normalized : obj.dec_raw;
        if (ra === undefined || dec === undefined) continue;

        const { x, y } = raDecToCanvas(ra, dec);
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        
        if (distance < 15) {
          found = obj;
          break;
        }
      }
      setHoveredObject(found);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const toggleSource = (source) => {
    setActiveSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  // Redraw on changes
  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Sample data for demo
  const sampleObjects = objects.length > 0 ? objects : [
    { id: 1, name: 'NGC 224 (Andromeda)', source: 'nasa', ra_normalized: 10.68, dec_normalized: 41.27, ra_raw: 10.5, dec_raw: 41.1, magnitude: 3.4 },
    { id: 2, name: 'M31 Core', source: 'esa', ra_normalized: 10.69, dec_normalized: 41.26, ra_raw: 10.7, dec_raw: 41.3, magnitude: 4.5 },
    { id: 3, name: 'NGC 6611', source: 'hubble', ra_normalized: 274.7, dec_normalized: -13.8, ra_raw: 274.5, dec_raw: -13.9, magnitude: 6.0 },
    { id: 4, name: 'Orion Nebula', source: 'observatory', ra_normalized: 83.82, dec_normalized: -5.39, ra_raw: 83.8, dec_raw: -5.4, magnitude: 4.0 },
    { id: 5, name: 'Sirius', source: 'gaia', ra_normalized: 101.29, dec_normalized: -16.72, ra_raw: 101.3, dec_raw: -16.7, magnitude: -1.46 },
    { id: 6, name: 'Vega', source: 'jwst', ra_normalized: 279.23, dec_normalized: 38.78, ra_raw: 279.2, dec_raw: 38.8, magnitude: 0.03 },
    { id: 7, name: 'Crab Nebula', source: 'nasa', ra_normalized: 83.63, dec_normalized: 22.01, ra_raw: 83.6, dec_raw: 22.0, magnitude: 8.4 },
    { id: 8, name: 'Pleiades', source: 'esa', ra_normalized: 56.87, dec_normalized: 24.12, ra_raw: 56.9, dec_raw: 24.1, magnitude: 1.6 },
  ];

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(5, prev * 1.2))}
          className="p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
          className="p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* View mode toggle */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button
          onClick={() => setViewMode(viewMode === 'normalized' ? 'raw' : 'normalized')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all ${
            viewMode === 'normalized'
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-card/80 border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          {viewMode === 'normalized' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="text-xs font-medium">
            {viewMode === 'normalized' ? 'Normalized' : 'Raw Data'}
          </span>
        </button>
      </div>

      {/* Source legend/toggle */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        {Object.entries(sourceColors).slice(0, 4).map(([source, color]) => (
          <button
            key={source}
            onClick={() => toggleSource(source)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border transition-all ${
              activeSources.includes(source)
                ? 'bg-card/80 border-border'
                : 'bg-card/40 border-transparent opacity-50'
            }`}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-foreground uppercase">{source}</span>
          </button>
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredObject && (
        <div className="absolute bottom-4 right-4 p-4 rounded-lg bg-card/95 backdrop-blur-sm border border-border min-w-[200px]">
          <h4 className="font-semibold text-foreground mb-2">{hoveredObject.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span className="text-foreground uppercase">{hoveredObject.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RA ({viewMode})</span>
              <span className="font-mono text-foreground">
                {viewMode === 'normalized' ? hoveredObject.ra_normalized : hoveredObject.ra_raw}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dec ({viewMode})</span>
              <span className="font-mono text-foreground">
                {viewMode === 'normalized' ? hoveredObject.dec_normalized : hoveredObject.dec_raw}°
              </span>
            </div>
            {hoveredObject.magnitude && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Magnitude</span>
                <span className="font-mono text-foreground">{hoveredObject.magnitude}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coordinate display */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border">
        <span className="text-xs text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}% | Objects: {sampleObjects.filter(o => activeSources.includes(o.source?.toLowerCase())).length}
        </span>
      </div>
    </div>
  );
};

export default SkyMap;

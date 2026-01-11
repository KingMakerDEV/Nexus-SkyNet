import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Orbital loader animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full pulse-glow" />
        </div>
        
        {/* Orbiting rings */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cosmic-cyan rounded-full" />
        </div>
        
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full" />
        </div>
        
        {/* Outer ring */}
        <div 
          className="absolute inset-0 border-2 border-primary/30 rounded-full animate-pulse"
          style={{ animationDuration: '2s' }}
        />
        
        {/* Inner ring */}
        <div 
          className="absolute inset-2 border border-accent/20 rounded-full"
        />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

// Full screen loader variant
export const FullScreenLoader = ({ text = 'Initializing COSMIC...' }) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <Loader size="xl" text="" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground text-glow">{text}</h2>
          <p className="text-sm text-muted-foreground">
            Connecting to astronomical data networks...
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline skeleton loader
export const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

// Data processing loader
export const DataProcessingLoader = ({ steps = [], currentStep = 0 }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            transition-all duration-300
            ${index < currentStep 
              ? 'bg-primary text-primary-foreground' 
              : index === currentStep 
                ? 'bg-primary/20 text-primary border-2 border-primary pulse-glow' 
                : 'bg-muted text-muted-foreground'
            }
          `}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={`text-sm ${
            index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {step}
          </span>
          {index === currentStep && (
            <div className="ml-2 w-4 h-4">
              <div className="w-full h-full border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Loader;

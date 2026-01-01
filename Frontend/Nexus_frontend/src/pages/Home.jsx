import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Database,
  Zap,
  Globe,
  Shield,
  Sparkles,
  ChevronRight,
  Star,
  ArrowRight,
  Layers,
  GitMerge,
  BarChart3,
  Users,
  Play,
} from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';

// Feature card component (unchanged)
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <div
    className="glass-hover rounded-2xl p-6 hover-lift group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

// Data source badge component (unchanged)
const SourceBadge = ({ name, icon, color }) => (
  <div
    className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 hover:border-primary/50 transition-all cursor-pointer hover:scale-105"
    style={{ backgroundColor: `${color}15` }}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium text-foreground">{name}</span>
  </div>
);

// Stats component (unchanged)
const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-primary text-glow">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

// Workflow step component (unchanged)
const WorkflowStep = ({ number, title, description, icon: Icon, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold glow-primary">
        {number}
      </div>
      {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mt-2" />}
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-primary" />
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const features = [
    {
      icon: Database,
      title: 'Multi-Source Ingestion',
      description: 'Seamlessly ingest data from NASA, ESA, observatories, and custom sources with automatic format detection.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: GitMerge,
      title: 'Smart Normalization',
      description: 'AI-powered data normalization that converts diverse formats into a unified coordinate system.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Validation Engine',
      description: 'Comprehensive validation checks ensure data integrity and scientific accuracy across all sources.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Layers,
      title: 'Unified Storage',
      description: 'Store and index astronomical objects with efficient querying and retrieval capabilities.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Powerful visualization tools for comparing and analyzing cross-source astronomical data.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Sparkles,
      title: 'AI Discovery',
      description: 'Machine learning algorithms to identify patterns and discover new astronomical phenomena.',
      color: 'from-cyan-500 to-teal-500',
    },
  ];

  const dataSources = [
    { name: 'NASA', icon: '🚀', color: '#3B82F6' },
    { name: 'ESA', icon: '🛸', color: '#8B5CF6' },
    { name: 'Hubble', icon: '🌌', color: '#F59E0B' },
    { name: 'JWST', icon: '✨', color: '#EF4444' },
    { name: 'Gaia', icon: '⭐', color: '#EC4899' },
    { name: 'Observatories', icon: '🔭', color: '#10B981' },
  ];

  const workflowSteps = [
    { icon: Database, title: 'Data Ingestion', description: 'Upload or connect to astronomical data sources in any format.' },
    { icon: GitMerge, title: 'Normalization', description: 'Automatic conversion to unified coordinate systems and schemas.' },
    { icon: Shield, title: 'Validation', description: 'Quality checks and cross-reference verification.' },
    { icon: Layers, title: 'Storage', description: 'Indexed storage with efficient query capabilities.' },
  ];

  return (
    <div className="min-h-screen bg-background star-field">
      {/* Background effects (unchanged) */}
      <div className="fixed inset-0 bg-cosmic-radial pointer-events-none" />
      <div className="fixed inset-0 bg-nebula-gradient pointer-events-none opacity-50" />
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Navigation - UPDATED LOGO HERE */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <img
                src="/nexus_logo.jpeg"  // ← Change to "/logo.svg" if using SVG
                alt="Your Platform Logo"
                className="h-10 w-auto transition-all duration-300 group-hover:scale-110"
              />
              {/* Optional pulsing dot for style */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            {/* Hidden for screen readers */}
            <span className="sr-only">Home</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#sources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Data Sources</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors glow-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Updated heading text */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Astronomical Data Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              Unify the
              <span className="text-primary text-glow"> Universe</span>
              <br />
              One Dataset at a Time
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              Transform fragmented astronomical data from NASA, ESA, and observatories into a unified,
              queryable knowledge base. Discover the universe with unprecedented clarity.
            </p>
            {/* CTAs unchanged */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold glass hover:bg-muted/50 transition-all"
              >
                <Play className="w-5 h-5" />
                View Demo
              </button>
            </div>
            {/* Stats unchanged */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <StatItem value="14,871+" label="Datasets Processed" />
              <StatItem value="5.2M" label="Celestial Objects" />
              <StatItem value="12" label="Connected Sources" />
              <StatItem value="99.9%" label="Accuracy Rate" />
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources section unchanged */}
      <section id="sources" className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">Integrating data from leading space agencies and observatories</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {dataSources.map((source, index) => (
              <SourceBadge key={index} {...source} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid unchanged */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for
              <span className="text-primary text-glow"> Space Scientists</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to ingest, normalize, store, and analyze astronomical data from multiple sources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Updated heading */}
      <section id="workflow" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground mb-8">
                Our intelligent pipeline transforms raw astronomical data into actionable insights in four simple steps.
              </p>
              <div className="space-y-2">
                {workflowSteps.map((step, index) => (
                  <WorkflowStep
                    key={index}
                    number={index + 1}
                    {...step}
                    isLast={index === workflowSteps.length - 1}
                  />
                ))}
              </div>
            </div>
            {/* Visualization unchanged */}
            <div className="relative">
              <div className="glass rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="font-mono text-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <span className="text-primary">platform</span>
                      <span className="text-foreground">ingest</span>
                      <span className="text-accent">--source nasa</span>
                    </div>
                    <div className="text-muted-foreground pl-4">
                      ✓ Connected to NASA Exoplanet Archive
                    </div>
                    <div className="text-muted-foreground pl-4">
                      ✓ Fetching 2,847 new records...
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-muted-foreground">$</span>
                      <span className="text-primary">platform</span>
                      <span className="text-foreground">normalize</span>
                      <span className="text-accent">--format ICRS</span>
                    </div>
                    <div className="text-muted-foreground pl-4">
                      ✓ Converting coordinates to ICRS...
                    </div>
                    <div className="text-green-500 pl-4 animate-pulse">
                      ✓ Pipeline complete! 2,847 objects indexed.
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section unchanged */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6 glow-primary">
              <Rocket className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Explore the Universe?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of researchers unlocking insights from astronomical data.
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer - UPDATED LOGO HERE */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"  // ← Same logo as nav
                alt="Your Platform Logo"
                className="h-10 w-auto object-contain"
              />
              {/* Optional text next to logo if you want a name */}
              {/* <span className="font-bold text-foreground">Your Platform Name</span> */}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">API</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Your Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSuccess={() => navigate('/dashboard')} />
    </div>
  );
};

export default Home;
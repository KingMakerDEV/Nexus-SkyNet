import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  RefreshCw,
  Globe,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Layers,
  Activity,
  Rocket,
  Sparkles,
  Satellite,
} from 'lucide-react';
import { motion } from 'framer-motion';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import SkyMap from '../components/visualization/SkyMap';

// Import Lenis
import Lenis from 'lenis';

// Custom cursor component
const AnimatedCursor = () => {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-primary/50 pointer-events-none z-50 mix-blend-difference transition-transform duration-75 ease-out" ref={cursorRef} />
  );
};

// Floating particles background
const SpaceBackground = () => {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: ['0%', '-100vh'],
            x: [0, Math.sin(particle.id) * 20],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      {/* Nebula effects */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

// Animated stat card component
const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
  <motion.div 
    className="glass-hover rounded-xl p-5 hover-lift border border-white/10 relative overflow-hidden group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true }}
  >
    {/* Background glow effect */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${color} blur-xl`} />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <motion.div 
          className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: 5 }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'increase' ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendingUp className={`w-3 h-3 ${changeType === 'decrease' ? 'rotate-180' : ''}`} />
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1 group-hover:text-white transition-colors">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Animated activity item component
const ActivityItem = ({ status, title, time, source }) => {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
    processing: { icon: RefreshCw, color: 'text-primary', bg: 'bg-primary/10', animate: true },
    failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  };

  const config = statusConfig[status] || statusConfig.completed;
  const Icon = config.icon;

  return (
    <motion.div 
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ x: 5 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className={`p-2 rounded-lg ${config.bg} group-hover:scale-110 transition-transform`}
        whileHover={{ rotate: 10 }}
      >
        <Icon className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-white truncate transition-colors">{title}</p>
        <p className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">{source}</p>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">{time}</span>
    </motion.div>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  // Sample data for charts
  const ingestionData = [
    { name: 'Mon', datasets: 45, objects: 12400 },
    { name: 'Tue', datasets: 52, objects: 15600 },
    { name: 'Wed', datasets: 38, objects: 9800 },
    { name: 'Thu', datasets: 65, objects: 21000 },
    { name: 'Fri', datasets: 58, objects: 18500 },
    { name: 'Sat', datasets: 42, objects: 13200 },
    { name: 'Sun', datasets: 47, objects: 14800 },
  ];

  const sourceData = [
    { name: 'NASA', count: 4521, color: '#3B82F6' },
    { name: 'ESA', count: 3842, color: '#8B5CF6' },
    { name: 'Hubble', count: 2156, color: '#F59E0B' },
    { name: 'JWST', count: 1823, color: '#EF4444' },
    { name: 'Gaia', count: 1547, color: '#EC4899' },
    { name: 'Other', count: 982, color: '#10B981' },
  ];

  const recentActivity = [
    { status: 'completed', title: 'Andromeda Galaxy Dataset', source: 'NASA Exoplanet Archive', time: '2m ago' },
    { status: 'processing', title: 'Gaia DR3 Star Catalog', source: 'ESA Gaia Mission', time: '5m ago' },
    { status: 'completed', title: 'JWST Deep Field Observation', source: 'James Webb Space Telescope', time: '12m ago' },
    { status: 'failed', title: 'Chandra X-ray Data', source: 'NASA Chandra Observatory', time: '25m ago' },
    { status: 'completed', title: 'Hubble Legacy Field', source: 'Hubble Space Telescope', time: '1h ago' },
  ];

  const pipelineStages = [
    { stage: 'Ingestion', count: 23, status: 'active', color: 'from-blue-500 to-cyan-500' },
    { stage: 'Validation', count: 18, status: 'active', color: 'from-green-500 to-emerald-500' },
    { stage: 'Normalization', count: 45, status: 'active', color: 'from-purple-500 to-pink-500' },
    { stage: 'Storage', count: 12, status: 'active', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <>
      <SpaceBackground />
      <AnimatedCursor />
      
      <div className="relative z-10 space-y-6 p-4 sm:p-6">
        {/* Header with animation */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary glow-primary"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                Mission Control
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Satellite className="w-4 h-4" />
                Unified astronomical data processing overview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all border border-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Last 7 days</span>
            </motion.button>
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all glow-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh Data</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid with staggered animation */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <StatCard
            icon={Database}
            title="Total Datasets"
            value="14,871"
            change="+12.5%"
            changeType="increase"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={CheckCircle2}
            title="Normalized"
            value="13,642"
            change="+8.2%"
            changeType="increase"
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Globe}
            title="Connected Sources"
            value="12"
            change="+2"
            changeType="increase"
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={Zap}
            title="Objects Processed"
            value="5.2M"
            change="+15.3%"
            changeType="increase"
            color="from-amber-500 to-orange-500"
          />
        </motion.div>

        {/* Charts Row with fade in */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Ingestion Trends */}
          <div className="glass rounded-xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Ingestion Trends</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                    Daily data processing activity
                  </p>
                </div>
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <LineChart
                data={ingestionData}
                xKey="name"
                lines={[
                  { dataKey: 'datasets', name: 'Datasets', color: 'hsl(200, 100%, 70%)' },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Source Distribution */}
          <div className="glass rounded-xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Data Sources</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                    Distribution by origin
                  </p>
                </div>
                <Layers className="w-5 h-5 text-secondary" />
              </div>
              <BarChart
                data={sourceData}
                xKey="name"
                bars={[{ dataKey: 'count', name: 'Datasets' }]}
                height={250}
                colorByValue
              />
            </div>
          </div>
        </motion.div>

        {/* Sky Map and Activity with fade in */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Interactive Sky Map */}
          <div className="lg:col-span-2 glass rounded-xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Sky Fusion Map</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                    Multi-source astronomical objects visualization
                  </p>
                </div>
                <motion.button 
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80  group-hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Full View</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="relative">
                <SkyMap height={350} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <motion.button 
                  className="text-sm text-primary hover:text-primary/80  group-hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all
                </motion.button>
              </div>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Processing Pipeline Status with connected animation */}
        <motion.div 
          className="glass rounded-xl p-6 border border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Processing Pipeline</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time data normalization status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Connecting lines */}
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 transform -translate-y-1/2" />
              <div className="hidden md:block absolute top-1/2 left-1/2 right-1/4 h-0.5 bg-gradient-to-r from-secondary/30 to-purple-500/30 transform -translate-y-1/2" />
              <div className="hidden md:block absolute top-1/2 left-3/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-500/30 to-orange-500/30 transform -translate-y-1/2" />
              
              {pipelineStages.map((stage, index) => (
                <motion.div 
                  key={index}
                  className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:scale-105 transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{stage.stage}</span>
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                    {stage.count}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 group-hover:text-white/60 transition-colors">
                    datasets in queue
                  </p>
                  {index < 3 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-white/40" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading overlay */}
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onAnimationComplete={() => setIsLoading(false)}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Satellite className="w-full h-full text-primary" />
              </motion.div>
              <p className="text-white text-lg font-semibold">Initializing Dashboard...</p>
              <p className="text-muted-foreground mt-2">Loading cosmic data streams</p>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
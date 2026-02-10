import React, { useState, useRef, useEffect } from 'react';
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
import { motion } from "framer-motion";
import LoginModal from '../components/auth/LoginModal';

// WebGL Shader Background Component
const ShaderBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const rendererRef = useRef(null);
  const pointersRef = useRef(null);

  class WebGLRenderer {
    constructor(canvas, scale) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext('webgl2');
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      this.shaderSource = defaultShaderSource;
      this.mouseMove = [0, 0];
      this.mouseCoords = [0, 0];
      this.pointerCoords = [0, 0];
      this.nbrOfPointers = 0;
      this.vertexSrc = `#version 300 es
        precision highp float;
        in vec4 position;
        void main() { gl_Position = position; }`;
      this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
    }

    updateShader(source) {
      this.reset();
      this.shaderSource = source;
      this.setup();
      this.init();
    }

    updateMove(deltas) {
      this.mouseMove = deltas;
    }

    updateMouse(coords) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords) {
      this.pointerCoords = coords;
    }

    updatePointerCount(nbr) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale) {
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader, source) {
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
    }

    setup() {
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER);
      this.fs = gl.createShader(gl.FRAGMENT_SHADER);
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram();
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);
    }

    init() {
      const gl = this.gl;
      const program = this.program;
      
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      program.resolution = gl.getUniformLocation(program, 'resolution');
      program.time = gl.getUniformLocation(program, 'time');
      program.move = gl.getUniformLocation(program, 'move');
      program.touch = gl.getUniformLocation(program, 'touch');
      program.pointerCount = gl.getUniformLocation(program, 'pointerCount');
      program.pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      
      gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(program.time, now * 1e-3);
      gl.uniform2f(program.move, ...this.mouseMove);
      gl.uniform2f(program.touch, ...this.mouseCoords);
      gl.uniform1i(program.pointerCount, this.nbrOfPointers);
      gl.uniform2fv(program.pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    reset() {
      const gl = this.gl;
      if (this.program) {
        gl.deleteProgram(this.program);
      }
    }
  }

  class PointerHandler {
    constructor(element, scale) {
      this.scale = scale;
      this.active = false;
      this.pointers = new Map();
      this.lastCoords = [0, 0];
      this.moves = [0, 0];

      const map = (element, scale, x, y) => 
        [x * scale, element.height - y * scale];

      element.addEventListener('pointerdown', (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
      });

      element.addEventListener('pointerup', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointermove', (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0 
        ? Array.from(this.pointers.values()).flat() 
        : [0, 0];
    }

    get first() {
      return this.pointers.values().next().value || this.lastCoords;
    }
  }

  const resize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now) => {
    if (!rendererRef.current || !pointersRef.current) return;
    
    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);
    
    rendererRef.current.setup();
    rendererRef.current.init();
    
    resize();
    loop(0);
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float
  a = rnd(i),
  b = rnd(i + vec2(1, 0)),
  c = rnd(i + vec2(0, 1)),
  d = rnd(i + 1.);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float t = .0, a = 1.; mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 5; i++) {
    t += a * noise(p);
    p *= 2. * m;
    a *= .5;
  }
  return t;
}

float clouds(vec2 p) {
  float d = 1., t = .0;
  for (float i = .0; i < 3.; i++) {
    float a = d * fbm(i * 10. + p.x * .2 + .2 * (1. + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2. / (i + 1.);
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - .5 * R) / MN, st = uv * vec2(2, 1);
  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T * .5, -st.y));
  uv *= 1. - .3 * (sin(T * .2) * .5 + .5);
  for (float i = 1.; i < 12.; i++) {
    uv += .1 * cos(i * vec2(.1 + .01 * i, .8) + i * i + T * .5 + .1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    col += .00125 / d * (cos(sin(i) * vec3(1, 2, 3)) + 1.);
    float b = noise(i + p + bg * 1.731);
    col += .002 * b / length(max(p, vec2(b * p.x * .02, p.y)));
    col = mix(col, vec3(bg * .25, bg * .137, bg * .05), d);
  }
  O = vec4(col, 1);
}`;

// Feature card component - FIXED
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay / 1000 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    className="glass-hover rounded-2xl p-6 hover-lift group"
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
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
    <div className="min-h-screen bg-background">
      {/* Replace star-field with WebGL shader background */}
      <div className="fixed inset-0 bg-black">
        <ShaderBackground />
      </div>
      
      {/* Keep nebula gradient effects but make them more subtle */}
      <motion.div
        className="fixed inset-0 bg-nebula-gradient pointer-events-none opacity-30"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />    
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0b1020]/80 backdrop-blur-lg border-b border-white/10">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <img
                src="/nexus_logo.jpeg"
                alt="Your Platform Logo"
                className="h-14 w-auto transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
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
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Astronomical Data Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Unify the
              <span className="text-primary text-glow"> Universe</span>
              <br />
              One Dataset at a Time
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Transform fragmented astronomical data from NASA, ESA, and observatories into a unified,
              queryable knowledge base. Discover the universe with unprecedented clarity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button
                onClick={() => setIsLoginOpen(true)}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-all glow-primary hover:scale-105 active:scale-95"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold glass hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5" />
                View Demo
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 glass rounded-2xl p-8"
            >
              <StatItem value="14,871+" label="Datasets Processed" />
              <StatItem value="5.2M" label="Celestial Objects" />
              <StatItem value="12" label="Connected Sources" />
              <StatItem value="99.9%" label="Accuracy Rate" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Sources section */}
      <section id="sources" className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">Integrating data from leading space agencies and observatories</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {dataSources.map((source, index) => (
              <SourceBadge key={index} {...source} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 relative z-10">
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

      {/* How it Works */}
      <section id="workflow" className="py-20 px-6 relative z-10">
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

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
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

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 relative z-10 bg-[#0b1020]/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <motion.img
                src="/nexus_logo.jpeg"
                alt="Logo"
                className="h-10 w-auto"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
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
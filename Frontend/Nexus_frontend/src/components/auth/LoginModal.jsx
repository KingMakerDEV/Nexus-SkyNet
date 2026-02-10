import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Rocket,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Github,
  Chrome,
  Globe,
  Satellite,
  Circle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [stars, setStars] = useState([]);

  // Generate floating stars
  useEffect(() => {
    if (!isOpen) return;

    const newStars = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));

    setStars(newStars);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onSuccess?.();
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Floating Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Nebula Effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Modal */}
        <motion.div 
          className="relative w-full max-w-md glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          
          {/* Animated orbiting elements */}
          <motion.div 
            className="absolute -top-6 -right-6 w-12 h-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-full h-full text-primary/30" />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-8 -left-8 w-16 h-16"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Circle className="w-full h-full text-secondary/20" />
          </motion.div>

          {/* Close button */}
          <motion.button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-all z-10 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="relative p-8">
            {/* Logo with animation */}
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(255, 215, 0, 0)',
                      '0 0 0 10px rgba(255, 215, 0, 0.1)',
                      '0 0 0 0 rgba(255, 215, 0, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
                </motion.div>
              </div>
            </motion.div>

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join COSMIC'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin 
                  ? 'Sign in to continue your cosmic journey' 
                  : 'Create an account to explore the universe'}
              </p>
            </motion.div>

            {/* OAuth buttons with stagger animation */}
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, staggerChildren: 0.1 }}
            >
              <motion.button 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                <span className="text-sm font-medium">Continue with Google</span>
              </motion.button>
              <motion.button 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="w-5 h-5 group-hover:text-gray-300 transition-colors" />
                <span className="text-sm font-medium">Continue with GitHub</span>
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="text-xs text-muted-foreground uppercase">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </motion.div>

            {/* Form with stagger animation */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {!isLogin && (
                <motion.div 
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-sm"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="text-sm font-medium text-white">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-sm"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-sm"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
                
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Toggle */}
            <motion.p 
              className="text-center text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <motion.button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </motion.button>
            </motion.p>

            {/* Terms */}
            {!isLogin && (
              <motion.p 
                className="text-center text-xs text-muted-foreground mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
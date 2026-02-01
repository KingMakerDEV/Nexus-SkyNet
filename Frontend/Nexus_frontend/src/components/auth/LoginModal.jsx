// import React, { useState } from 'react';
// import {
//   X,
//   Mail,
//   Lock,
//   User,
//   Rocket,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Sparkles,
//   Github,
//   Chrome,
// } from 'lucide-react';

// const LoginModal = ({ isOpen, onClose, onSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulate authentication
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     setIsLoading(false);
//     onSuccess?.();
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-background/80 backdrop-blur-sm"
//         onClick={onClose}
//       />
      
//       {/* Modal */}
//       <div className="relative w-full max-w-md glass rounded-2xl overflow-hidden animate-fade-in">
//         {/* Background effects */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        
//         {/* Close button */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="relative p-8">
//           {/* Logo */}
//           <div className="flex justify-center mb-6">
//             <div className="relative">
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
//                 <Rocket className="w-8 h-8 text-primary-foreground" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse flex items-center justify-center">
//                 <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
//               </div>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-foreground mb-2">
//               {isLogin ? 'Welcome Back' : 'Join COSMIC'}
//             </h2>
//             <p className="text-muted-foreground text-sm">
//               {isLogin 
//                 ? 'Sign in to continue your cosmic journey' 
//                 : 'Create an account to explore the universe'}
//             </p>
//           </div>

//           {/* OAuth buttons */}
//           <div className="space-y-3 mb-6">
//             <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
//               <Chrome className="w-5 h-5" />
//               <span className="text-sm font-medium">Continue with Google</span>
//             </button>
//             <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
//               <Github className="w-5 h-5" />
//               <span className="text-sm font-medium">Continue with GitHub</span>
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex-1 h-px bg-border" />
//             <span className="text-xs text-muted-foreground uppercase">or</span>
//             <div className="flex-1 h-px bg-border" />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-foreground">Full Name</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your name"
//                     className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
//                     required={!isLogin}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-foreground">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                   className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium text-foreground">Password</label>
//                 {isLogin && (
//                   <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
//                     Forgot password?
//                   </a>
//                 )}
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className="w-full h-12 pl-11 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
//               ) : (
//                 <>
//                   {isLogin ? 'Sign In' : 'Create Account'}
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Toggle */}
//           <p className="text-center text-sm text-muted-foreground mt-6">
//             {isLogin ? "Don't have an account?" : 'Already have an account?'}
//             <button
//               onClick={() => setIsLogin(!isLogin)}
//               className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors"
//             >
//               {isLogin ? 'Sign up' : 'Sign in'}
//             </button>
//           </p>

//           {/* Terms */}
//           {!isLogin && (
//             <p className="text-center text-xs text-muted-foreground mt-4">
//               By creating an account, you agree to our{' '}
//               <a href="#" className="text-primary hover:underline">Terms of Service</a>
//               {' '}and{' '}
//               <a href="#" className="text-primary hover:underline">Privacy Policy</a>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;


import React, { useState } from 'react';
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
} from 'lucide-react';

// ✅ NEW
import { loginUser, registerUser } from '@/api/authApi';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  // ✅ UPDATED: real backend call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let res;

      if (isLogin) {
        // 🔵 LOGIN
        res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // 🔵 SIGNUP
        res = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      console.log("Auth Success:", res.data);

      onSuccess?.(res.data);
      onClose();

    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md glass rounded-2xl overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8">

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
                <Rocket className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Join COSMIC'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? 'Sign in to continue your cosmic journey' 
                : 'Create an account to explore the universe'}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border border-border"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl bg-muted border border-border px-4"
              />
            </div>

            <div className="space-y-2">
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl bg-muted border border-border px-4"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-4">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

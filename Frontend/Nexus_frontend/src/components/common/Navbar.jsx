import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Rocket, 
  Search, 
  Bell, 
  Settings,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary transition-all duration-300 group-hover:scale-110">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              COSMIC
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-1 tracking-widest uppercase">
              Data Fusion
            </p>
          </div>
        </Link>

        {/* Search bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets, objects, coordinates..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-muted transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Systems Online</span>
          </div>

          {/* AI Discovery quick access */}
          <Link
            to="/ai-discovery"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              location.pathname === '/ai-discovery'
                ? 'bg-secondary/20 text-secondary'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">AI</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* User avatar */}
          <button className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-semibold text-primary-foreground ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            U
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

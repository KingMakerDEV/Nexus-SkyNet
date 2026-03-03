import React, { useState } from 'react'; // Add useState import
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserMenu from '../ui/UserMenu';
import LoginModal from '../auth/LoginModal';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // This was missing

  return (
    <>
      <header className="
        fixed top-0 left-0 right-0 z-40 h-16
        bg-gradient-to-r from-[#050814] via-[#0B1026] to-[#0E1433]
        backdrop-blur-xl
        border-b border-white/10
      ">
        <div className="h-full px-6 flex items-center justify-between">

          {/* 🔷 LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/nexus_logo.jpeg"
              alt="Nexus SkyNet"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* 🔍 Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets, objects, coordinates..."
                className="
                  w-full h-10 pl-10 pr-4 rounded-lg
                  bg-white/5 border border-white/10
                  text-sm text-white placeholder:text-gray-400
                  focus:outline-none focus:border-indigo-500
                  transition-all
                "
              />
            </div>
          </div>

          {/* ⚙ Right Section */}
          <div className="flex items-center gap-2">

            {/* AI */}
            <Link
              to="/ai-discovery"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                location.pathname === '/ai-discovery'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">AI</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User - Conditionally show UserMenu or Login button */}
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="
                  ml-2 px-4 py-2 rounded-lg
                  bg-gradient-to-r from-indigo-500 to-purple-600
                  text-sm font-semibold text-white
                  hover:opacity-90 transition-all
                "
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;
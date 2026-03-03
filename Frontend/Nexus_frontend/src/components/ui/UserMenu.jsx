import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  // Get initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    // Handle cases where name might be empty or just first name
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      // If only first name, show first letter
      return nameParts[0].charAt(0).toUpperCase();
    }
    // If full name, show first letters of first and last name
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(user.name || user.username || 'User');

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {/* Avatar with initials */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
          {initials}
        </div>
        
        {/* User name */}
        <span className="hidden md:inline text-sm font-medium text-white">
          {user.name || user.username || 'User'}
        </span>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for clicking outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-[#0B1026] backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.name || user.username || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
              </div>

              {/* Menu items */}
              <div className="p-1">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-white/10 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Monitor, Globe, Menu, X, FileText, User, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { themeMode, isDark, setThemeMode } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown]')) {
        setShowLanguageDropdown(false);
        setShowThemeDropdown(false);
        setShowUserDropdown(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/ai-chat', label: t('Ask Bot') },
    { path: '/media-gallery', label: t('Media') },
    { path: '/document-helper', label: t('Guide') },
    { path: '/document-verification', label: t('Verify') },
    { path: '/legal-summaries', label: t('Legal Summaries') },
    { path: '/about', label: t('aboutUs') },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
  ];

  const themeOptions = [
    { mode: 'light' as const, name: 'Light', icon: Sun },
    { mode: 'dark' as const, name: 'Dark', icon: Moon },
    { mode: 'system' as const, name: 'System', icon: Monitor },
  ];

  const getCurrentThemeIcon = () => {
    switch (themeMode) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  };

  const CurrentThemeIcon = getCurrentThemeIcon();

  return (
    <>
      <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-[90%] h-[70px] flex items-center justify-between rounded-[20px] px-4 sm:px-[18px] transition-all duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border border-slate-700/50 shadow-[3px_25px_50px_-12px_rgba(0,0,0,0.5)]' 
          : 'bg-white/95 border border-slate-200/50 shadow-[3px_25px_50px_-12px_rgba(0,0,0,0.25)]'
      } backdrop-blur-md`}>
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Docqulio</span>
        </Link>
        </motion.div>

        {/* Desktop Navigation - Only show if authenticated */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            // Show Home and About for everyone, other pages only for authenticated users
            if (!isAuthenticated && item.path !== '/' && item.path !== '/about') {
              return null;
            }
            return (
              <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative" data-dropdown>
            <motion.button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </motion.button>
            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div 
                  className="absolute right-0 mt-2 w-32 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      currentLanguage === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {lang.name}
                  </motion.button>
                ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <div className="relative" data-dropdown>
            <motion.button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ 
                  rotate: themeMode === 'dark' ? 180 : 0,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 0.5 },
                  scale: { duration: 0.3 }
                }}
              >
                <CurrentThemeIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {showThemeDropdown && (
                <motion.div 
                  className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.mode}
                    onClick={() => {
                      setThemeMode(option.mode);
                      setShowThemeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2 ${
                      themeMode === option.mode ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.name}</span>
                  </motion.button>
                ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Authentication */}
          {isAuthenticated ? (
            <div className="relative" data-dropdown>
              <motion.button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-6 h-6 rounded-full"
                  whileHover={{ scale: 1.1 }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user?.name}
                </span>
              </motion.button>
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <motion.button
                    onClick={() => {
                      signOut();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              data-navbar-auth
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{t('signIn')}</span>
            </motion.button>
          )}

          {/* Mobile Menu Button - Only show if authenticated */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
              <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation - Only show if authenticated */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="absolute top-full left-0 right-0 mt-2 lg:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-4 z-50"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
            <div className="space-y-2 px-4">
              {navItems.map((item) => (
                // Show Home and About for everyone, other pages only for authenticated users
                (!isAuthenticated && item.path !== '/' && item.path !== '/about') ? null : (
                  <motion.div key={item.path} whileHover={{ x: 4 }}>
                    <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                  </motion.div>
                )
              ))}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Navbar;
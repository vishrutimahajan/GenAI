import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Shield, FileSearch, Bot, Users, Newspaper, Star, CheckCircle } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import PageTransition from '../components/PageTransition';
import AnimatedCursor from '../components/AnimatedCursor';
import CountUpAnimation from '../components/CountUpAnimation';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const heroRef = React.useRef(null);
  const featuresRef = React.useRef(null);
  const newsRef = React.useRef(null);
  const statusRef = React.useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const newsInView = useInView(newsRef, { once: true });
  const statusInView = useInView(statusRef, { once: true });

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Document Analysis',
      description: 'Advanced AI analyzes your documents and explains complex terms in simple language.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Document Verification',
      description: 'Verify the authenticity of documents and detect potential fraud or discrepancies.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileSearch,
      title: 'Smart Document Helper',
      description: 'Step-by-step guidance for creating and submitting government documents.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Multi-Language Support',
      description: 'Available in Hindi, Marathi, Tamil, Bengali, Telugu, and other Indian languages.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const newsItems = [
    {
      title: 'New Digital India Initiative for Document Processing',
      date: '2 days ago',
      summary: 'Government launches new digital platform for faster document verification...'
    },
    {
      title: 'Aadhaar-Based Document Updates Now Available Online',
      date: '1 week ago',
      summary: 'Citizens can now update personal documents using Aadhaar authentication...'
    },
    {
      title: 'Enhanced Security Features for Government Documents',
      date: '2 weeks ago',
      summary: 'New security measures implemented to prevent document forgery...'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen w-full relative">
        <AnimatedCursor />
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="pt-32 pb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                AI-Powered
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> Document Assistant</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Simplify document processing with AI. Get instant explanations, verify authenticity, and navigate government procedures with confidence.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {isAuthenticated ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                    to="/ai-chat"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>{t('getStarted')}</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{t('getStarted')}</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-300/50 dark:border-white/20"
                >
                  Explore Features
                </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={featuresRef}
          className="py-20 bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                Powerful Features for Document Management
              </motion.h2>
              <motion.p 
                className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Everything you need to understand, verify, and process documents efficiently
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group p-6 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-white/20"
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* News & Updates Section */}
        <motion.section 
          ref={newsRef}
          className="py-20"
          initial={{ opacity: 0 }}
          animate={newsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={newsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  Latest Government Updates
                </motion.h2>
                <motion.p 
                  className="text-slate-700 dark:text-slate-300"
                  initial={{ opacity: 0, x: -30 }}
                  animate={newsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Stay informed about document-related policy changes and announcements
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={newsInView ? { opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </div>

            {/* Scrolling News Ticker */}
            <motion.div 
              className="overflow-hidden bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={newsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="flex space-x-8 text-sm text-blue-700 dark:text-blue-300"
                animate={{ x: [0, -1000] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <span>🔔 New Digital India Initiative launched for faster document processing</span>
                <span>📋 Aadhaar-based document updates now available online</span>
                <span>🔒 Enhanced security features implemented for government documents</span>
                <span>⚡ AI-powered verification system reduces processing time by 60%</span>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {newsItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 dark:bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200/50 dark:border-white/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={newsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <motion.div 
                      className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* System Status Section */}
        <motion.section 
          ref={statusRef}
          className="py-16 bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={statusInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={statusInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                System Status & Features
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center p-6 bg-green-100/80 dark:bg-green-500/20 rounded-2xl border border-green-300/50 dark:border-green-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statusInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  AI Services Online
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  All AI processing services are running smoothly
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-6 bg-blue-100/80 dark:bg-blue-500/20 rounded-2xl border border-blue-300/50 dark:border-blue-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statusInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Star className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  <CountUpAnimation end={99.9} suffix="% Accuracy" />
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  High accuracy in document analysis and verification
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-6 bg-purple-100/80 dark:bg-purple-500/20 rounded-2xl border border-purple-300/50 dark:border-purple-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statusInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(147, 51, 234, 0.4)",
                      "0 0 0 10px rgba(147, 51, 234, 0)",
                      "0 0 0 0 rgba(147, 51, 234, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block rounded-full"
                >
                  <Shield className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Your data is encrypted and processed securely
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <motion.section 
            className="py-20 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm border-t border-slate-200/50 dark:border-white/10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-xl text-slate-700 dark:text-slate-300 mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Join thousands of users who trust our AI-powered document assistance
              </motion.p>
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-slate-100 dark:bg-white dark:hover:bg-slate-100 text-blue-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <span>Start Using AI Assistant</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.section>
        )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      </div>
    </PageTransition>
  );
};

export default Home;
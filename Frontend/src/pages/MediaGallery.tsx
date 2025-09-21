// src/pages/MediaGallery.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Download, Trash2, Eye, Filter, Search, Loader, AlertTriangle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AnimatedCursor from '../components/AnimatedCursor';
import CountUpAnimation from '../components/CountUpAnimation';
import { useAuth } from '../contexts/AuthContext';
// 1. Updated interfaces to use the secure `access_url` from the backend
interface GCSFile {
  filename: string;
  access_url: string; 
  content_type: string;
  size: number;
  last_modified: string;
}

interface MediaFile {
  id: string; 
  name: string;
  type: 'document' | 'image';
  size: string;
  uploadDate: Date;
  access_url: string;
  category: 'user-input';
}

const API_URL = 'http://localhost:8000'; // Your backend URL

const MediaGallery: React.FC = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'document' | 'image'>('all');
  
  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) {
        setError("Please log in to view your media gallery.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/docs/${user.uid}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch files.');
        }

        const data: GCSFile[] = await response.json();

        // Map the raw API data to the MediaFile interface for the UI
        const formattedFiles = data.map((file): MediaFile => {
          const isImage = file.content_type.startsWith('image/');
          
          let formattedSize: string;
          if (file.size < 1024) {
            formattedSize = `${file.size} B`;
          } else if (file.size < 1024 * 1024) {
            formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
          } else {
            formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          }

          return {
            id: file.access_url, // The signed URL is unique enough for a key
            name: file.filename,
            type: isImage ? 'image' : 'document',
            size: formattedSize,
            uploadDate: new Date(file.last_modified),
            access_url: file.access_url,
            category: 'user-input',
          };
        });

        setFiles(formattedFiles);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [user]);

  const filteredFiles = useMemo(() => {
    return files
      .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(file => filterType === 'all' || file.type === filterType);
  }, [files, searchTerm, filterType]);

  const stats = useMemo(() => ({
    total: files.length,
    documents: files.filter(f => f.type === 'document').length,
    images: files.filter(f => f.type === 'image').length,
  }), [files]);

  const getFileIcon = (type: 'document' | 'image') => {
    return type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  return (
    <PageTransition>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <AnimatedCursor />
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="mb-2 text-3xl font-bold text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Media Gallery
          </motion.h1>
          <motion.p 
            className="text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage and view your uploaded documents and images.
          </motion.p>
        </div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="p-6 shadow-md bg-white/95 dark:bg-slate-800 rounded-xl"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              <CountUpAnimation end={stats.total} />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Files</div>
          </motion.div>
          <motion.div 
            className="p-6 shadow-md bg-white/95 dark:bg-slate-800 rounded-xl"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-2xl font-bold text-blue-600">
              <CountUpAnimation end={stats.documents} />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Documents</div>
          </motion.div>
          <motion.div 
            className="p-6 shadow-md bg-white/95 dark:bg-slate-800 rounded-xl"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="text-2xl font-bold text-purple-600">
              <CountUpAnimation end={stats.images} />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Images</div>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex flex-col gap-4 mb-6 lg:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
            <motion.input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border bg-white/95 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 border bg-white/95 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
            </select>
          </div>
        </motion.div>
        
        {/* Conditional Rendering for Loading, Error, and Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center p-4 space-x-3 text-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-300">
            <AlertTriangle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  className="transition-all duration-300 shadow-md bg-white/95 dark:bg-slate-800 rounded-xl hover:shadow-lg group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative flex items-center justify-center overflow-hidden aspect-video bg-slate-100 dark:bg-slate-700 rounded-t-xl">
                    {file.type === 'image' ? (
                      <motion.img
                        src={file.access_url}
                        alt={file.name}
                        className="object-cover w-full h-full"
                        whileHover={{ scale: 1.1 }}
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-slate-400" />
                    )}
                    <div className="absolute flex items-center px-2 py-1 space-x-1 text-xs font-medium text-blue-600 rounded-lg top-2 right-2 bg-blue-50 dark:bg-blue-900/20">
                      {getFileIcon(file.type)}
                      <span>{file.type.charAt(0).toUpperCase() + file.type.slice(1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-semibold truncate text-slate-900 dark:text-white" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{file.size}</span>
                      <span>{file.uploadDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a href={file.access_url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <motion.button className="flex items-center justify-center w-full px-3 py-2 space-x-1 text-xs font-medium text-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </motion.button>
                      </a>
                       <a href={file.access_url} download={file.name} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                         <Download className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                       </a>
                      <motion.button 
                        className="p-2 rounded-lg opacity-50 cursor-not-allowed bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Delete functionality to be implemented"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredFiles.length === 0 && !isLoading && (
              <motion.div 
                className="py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">No files match your search</h3>
                <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or search term.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default MediaGallery;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Download, X, Maximize2, Scale, AlertCircle, CheckCircle, Info, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AnimatedCursor from '../components/AnimatedCursor';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext

interface AnalysisReport {
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  legalTerms: Array<{
    term: string;
    definition: string;
  }>;
  confidence: number;
}

const LegalDocumentSummaries: React.FC = () => {
    const { user } = useAuth(); // Get logged-in user
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [showFullscreenReport, setShowFullscreenReport] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfRotation, setPdfRotation] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisReport(null);
      
      // Create preview URL for PDF
      if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setPdfPreviewUrl(url);
      } else {
        setPdfPreviewUrl(null);
      }
    }
  };
const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    // Simulate AI analysis process
    setTimeout(() => {
      const mockReport: AnalysisReport = {
        summary: "This is a standard employment contract containing typical clauses for full-time employment. The document outlines compensation, benefits, working conditions, and termination procedures. Overall, the terms appear fair and balanced for both parties.",
        keyPoints: [
          "Employment term: Permanent full-time position",
          "Salary: ₹8,50,000 per annum with annual review",
          "Working hours: 40 hours per week, Monday to Friday",
          "Notice period: 30 days for resignation",
          "Probation period: 6 months from start date",
          "Benefits include health insurance and provident fund"
        ],
        risks: [
          "Non-compete clause extends for 12 months post-employment",
          "Intellectual property clause assigns all work-related IP to company",
          "Termination clause allows dismissal without cause with 30 days notice",
          "Overtime compensation not clearly specified"
        ],
        recommendations: [
          "Consider negotiating the non-compete period to 6 months",
          "Clarify overtime compensation policy",
          "Request specific definition of 'confidential information'",
          "Ensure performance review criteria are documented"
        ],
        legalTerms: [
          {
            term: "Non-compete clause",
            definition: "A contractual agreement that prevents an employee from working for competitors or starting a competing business for a specified period after leaving the company."
          },
          {
            term: "Intellectual Property (IP)",
            definition: "Creations of the mind, such as inventions, designs, and artistic works, that can be legally owned and protected."
          },
          {
            term: "Probation period",
            definition: "An initial employment period during which the employer can evaluate the employee's performance and suitability for the role."
          }
        ],
        confidence: 94
      };
      setAnalysisReport(mockReport);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleDownloadReport = async () => {
    if (!uploadedFile || !user) return; // Must have uploaded file and authenticated user
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('output_language', 'English');
      formData.append('user_id', user.uid); // Use authenticated user id

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/documents/verify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `verification_report.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to download the report.');
    }
  };


  const resetUpload = () => {
    setUploadedFile(null);
    setAnalysisReport(null);
    setIsAnalyzing(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    setPdfZoom(100);
    setPdfRotation(0);
  };

  const handleZoomIn = () => {
    setPdfZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setPdfZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setPdfRotation(prev => (prev + 90) % 360);
  };

  // Clean up URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedCursor />
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Legal Document Summaries
          </motion.h1>
          <motion.p 
            className="text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload legal documents to get AI-powered analysis, summaries, and risk assessments
          </motion.p>
        </motion.div>

        {!uploadedFile ? (
          /* Upload Section */
          <motion.div 
            className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="text-center">
              <motion.div 
                className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <Upload className="w-8 h-8 text-blue-600" />
              </motion.div>
              <motion.h2 
                className="text-xl font-semibold text-slate-900 dark:text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Upload Legal Document
              </motion.h2>
              <motion.p 
                className="text-slate-600 dark:text-slate-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Supported formats: PDF, DOC, DOCX (Max size: 10MB)
              </motion.p>

              <motion.div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 mb-6 transition-all duration-300"
                whileHover={{ 
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              >
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    </motion.div>
                    <motion.p 
                      className="text-slate-600 dark:text-slate-400 text-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      Click to upload or drag and drop your legal document here
                    </motion.p>
                    <motion.p 
                      className="text-slate-500 dark:text-slate-500 text-sm mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Contracts, agreements, legal notices, and other legal documents
                    </motion.p>
                  </div>
                </label>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Two Panel Layout */
          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
            {/* Left Panel - Document Viewer */}
            <motion.div 
              className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{uploadedFile.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
                
                <div className="flex items-center space-x-2">
                  {/* PDF Controls */}
                  {pdfPreviewUrl && (
                    <motion.div 
                      className="flex items-center space-x-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        onClick={handleZoomOut}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Zoom Out"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </motion.button>
                      <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
                        {pdfZoom}%
                      </span>
                      <motion.button
                        onClick={handleZoomIn}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Zoom In"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </motion.button>
                      <motion.button
                        onClick={handleRotate}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Rotate"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <RotateCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </motion.button>
                    </motion.div>
                  )}
                  
                  <motion.button
                    onClick={resetUpload}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </motion.button>
                </div>
              </div>
              
              <div className="h-full overflow-auto bg-slate-50 dark:bg-slate-700/50">
                {pdfPreviewUrl ? (
                  <motion.div 
                    className="p-4 h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.iframe
                      src={pdfPreviewUrl}
                      className="w-full h-full rounded-lg shadow-md border border-slate-200 dark:border-slate-600"
                      title="PDF Preview"
                      style={{
                        transform: `scale(${pdfZoom / 100}) rotate(${pdfRotation}deg)`,
                        transformOrigin: 'center center'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    className="p-6 h-full flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 dark:text-slate-400">Document Preview</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                        {uploadedFile.type === 'application/pdf' 
                          ? 'Loading PDF preview...' 
                          : 'Preview available for PDF files only'
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right Panel - Analysis Report */}
            <motion.div 
              className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <motion.h3 
                  className="font-semibold text-slate-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Analysis Report
                </motion.h3>
                {!isAnalyzing && !analysisReport && (
                  <motion.button
                    onClick={handleAnalyze}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Analyze Document
                  </motion.button>
                )}
                {analysisReport && (
                  <motion.div 
                    className="flex space-x-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={() => setShowFullscreenReport(true)}
                      className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      title="Fullscreen View"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Maximize2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </motion.button>
                    <motion.button
                      onClick={handleDownloadReport}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      title="Download Report"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </motion.button>
                  </motion.div>
                )}
              </div>

              <div className="p-6 h-full overflow-y-auto">
                <AnimatePresence mode="wait">
                  {!isAnalyzing && !analysisReport && (
                    <motion.div 
                      className="h-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Scale className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        </motion.div>
                        <motion.p 
                          className="text-slate-600 dark:text-slate-400"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Click "Analyze Document" to start
                        </motion.p>
                      </div>
                    </motion.div>
                  )}

                  {isAnalyzing && (
                    <motion.div 
                      className="h-full flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                        />
                        <motion.p 
                          className="text-slate-600 dark:text-slate-400"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Analyzing document...
                        </motion.p>
                        <motion.p 
                          className="text-sm text-slate-500 dark:text-slate-500 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          This may take a few moments
                        </motion.p>
                      </div>
                    </motion.div>
                  )}

                  {analysisReport && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Confidence Score */}
                      <motion.div 
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Analysis Confidence</span>
                          <motion.span 
                            className="text-lg font-bold text-blue-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          >
                            {analysisReport.confidence}%
                          </motion.span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisReport.confidence}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </motion.div>

                      {/* Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, delay: 0.5 }}
                          >
                            <Info className="w-4 h-4 mr-2 text-blue-600" />
                          </motion.div>
                          Executive Summary
                        </h4>
                        <motion.p 
                          className="text-slate-700 dark:text-slate-300 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {analysisReport.summary}
                        </motion.p>
                      </motion.div>

                      {/* Key Points */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, delay: 0.7 }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          </motion.div>
                          Key Points
                        </h4>
                        <div className="space-y-2">
                          {analysisReport.keyPoints.map((point, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              whileHover={{ x: 4 }}
                            >
                              <motion.div 
                                className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">{point}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Risks */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, delay: 1 }}
                          >
                            <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                          </motion.div>
                          Potential Risks
                        </h4>
                        <div className="space-y-2">
                          {analysisReport.risks.map((risk, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.1 + index * 0.1 }}
                              whileHover={{ x: 4 }}
                            >
                              <motion.div 
                                className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">{risk}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* Fullscreen Report Modal - Fixed positioning to avoid navbar overlap */}
        <AnimatePresence>
          {showFullscreenReport && analysisReport && (
            <motion.div 
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowFullscreenReport(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ paddingTop: '7rem' }}
            >
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[calc(100vh-10rem)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div 
                  className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Analysis Report</h2>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={handleDownloadReport}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowFullscreenReport(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </motion.button>
                  </div>
                </motion.div>

                <div className="p-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
                  <motion.div 
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Stats Cards */}
                    <motion.div 
                      className="grid md:grid-cols-2 gap-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div 
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)" }}
                      >
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Analysis Confidence</h3>
                        <motion.div 
                          className="text-3xl font-bold text-blue-600 mb-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        >
                          {analysisReport.confidence}%
                        </motion.div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                          <motion.div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisReport.confidence}%` }}
                            transition={{ delay: 0.8, duration: 1.5 }}
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.1)" }}
                      >
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Document Status</h3>
                        <motion.div 
                          className="flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </motion.div>
                          <span className="text-lg font-medium text-green-600">Analysis Complete</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Complete sections with all data */}
                    <motion.div 
                      className="grid md:grid-cols-2 gap-8"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div>
                        <motion.h3 
                          className="text-xl font-bold text-slate-900 dark:text-white mb-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          Key Points & Recommendations
                        </motion.h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-green-600 mb-3">Key Points</h4>
                            <div className="space-y-2">
                              {analysisReport.keyPoints.map((point, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-start space-x-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.7 + index * 0.1 }}
                                  whileHover={{ x: 4 }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  </motion.div>
                                  <span className="text-slate-700 dark:text-slate-300">{point}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-blue-600 mb-3">Recommendations</h4>
                            <div className="space-y-2">
                              {analysisReport.recommendations.map((rec, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-start space-x-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1 + index * 0.1 }}
                                  whileHover={{ x: 4 }}
                                >
                                  <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                                  >
                                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  </motion.div>
                                  <span className="text-slate-700 dark:text-slate-300">{rec}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <motion.h3 
                          className="text-xl font-bold text-slate-900 dark:text-white mb-4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          Risks & Legal Terms
                        </motion.h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-red-600 mb-3">Potential Risks</h4>
                            <div className="space-y-2">
                              {analysisReport.risks.map((risk, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-start space-x-2"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.7 + index * 0.1 }}
                                  whileHover={{ x: -4 }}
                                >
                                  <motion.div
                                    animate={{ 
                                      rotate: [0, 10, -10, 0],
                                      scale: [1, 1.2, 1]
                                    }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                  >
                                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  </motion.div>
                                  <span className="text-slate-700 dark:text-slate-300">{risk}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-purple-600 mb-3">Legal Terms Explained</h4>
                            <div className="space-y-3">
                              {analysisReport.legalTerms.map((term, index) => (
                                <motion.div 
                                  key={index} 
                                  className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1 + index * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="font-medium text-slate-900 dark:text-white mb-1">{term.term}</div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">{term.definition}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Executive Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Executive Summary</h3>
                      <motion.div 
                        className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6"
                        whileHover={{ scale: 1.01 }}
                      >
                        <motion.p 
                          className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          {analysisReport.summary}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default LegalDocumentSummaries;
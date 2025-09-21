

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Shield, Download, CheckCircle, AlertTriangle, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScanningLine from '../components/ScanningLine';
import VerifiedStamp from '../components/VerifiedStamp';
import AnimatedCursor from '../components/AnimatedCursor';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext

interface VerificationResult {
  status: 'authentic' | 'suspicious' | 'fake' | 'verified' | 'indeterminate' | 'error';
  confidence: number;
  findings: string[];
  recommendations: string[];
  simpleAnalyze?: string | string[]; // allow both string and array
}

const DocumentVerification: React.FC = () => {
  const { user } = useAuth(); // Get logged-in user
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  // Step 1: Simple Analyze
  const handleSimpleAnalyze = async () => {
    if (!uploadedFile) return;
    setIsVerifying(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('description', description);

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/documents/simple-analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      const result: VerificationResult = await response.json();
      setVerificationResult(result);
    } catch (err) {
      console.error(err);
      setVerificationResult({
        status: 'suspicious',
        confidence: 0,
        findings: ['Error occurred while analyzing document.'],
        recommendations: ['Please try again later.'],
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 2: Download PDF
  const handleDownloadReport = async () => {
    if (!uploadedFile || !user) return; // Must have uploaded file and authenticated user
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('description', description);
      formData.append('output_language', 'English');
      formData.append('user_id', user.id); // Use authenticated user id

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'suspicious': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'fake': return <X className="w-6 h-6 text-red-600" />;
      default: return <Shield className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authentic': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'suspicious': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'fake': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-700';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedCursor />
        <div className="text-center mb-8">
          <motion.h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Document Verification
          </motion.h1>
          <motion.p className="text-slate-600 dark:text-slate-400" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            Upload documents to verify their authenticity using AI-powered analysis
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!verificationResult ? (
            <motion.div className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 backdrop-blur-sm relative" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <ScanningLine isScanning={isVerifying} />
              <div className="text-center">
                {uploadedFile ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-slate-900 dark:text-white">{uploadedFile.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button onClick={() => setUploadedFile(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input type="file" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" />
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400">Click to upload or drag and drop your document here</p>
                    </div>
                  </label>
                )}

                <div className="text-left mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Document Description (Optional)</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide any additional context about this document..." rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl" />
                </div>

                <motion.button onClick={handleSimpleAnalyze} disabled={!uploadedFile || isVerifying} className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl">
                  {isVerifying ? 'Verifying...' : 'Analyze Document'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div className="bg-white/95 dark:bg-slate-800 rounded-2xl shadow-lg p-8 backdrop-blur-sm relative mt-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <VerifiedStamp show={verificationResult.status === 'authentic'} />
              <div className="text-center mb-8">
                {getStatusIcon(verificationResult.status)}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Verification Complete</h2>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(verificationResult.status)}`}>
                  {verificationResult.status.toUpperCase()} ({verificationResult.confidence}% confidence)
                </div>  
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
                  <ul className="space-y-2">
                    {verificationResult.findings.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>{f}</span>
                      </li>
                    ))}

                    {/* ✅ Add Simple Analyze output here */}
                    {verificationResult.simpleAnalyze && (
                      Array.isArray(verificationResult.simpleAnalyze)
                        ? verificationResult.simpleAnalyze.map((s, i) => (
                            <li key={`sa-${i}`} className="flex items-start space-x-2">
                              <FileText className="w-5 h-5 text-purple-600" />
                              <span>{s}</span>
                            </li>
                          ))
                        : (
                            <li className="flex items-start space-x-2">
                              <FileText className="w-5 h-5 text-purple-600" />
                              <span>{verificationResult.simpleAnalyze}</span>
                            </li>
                          )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {verificationResult.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleDownloadReport} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl">
                  <Download className="w-5 h-5 mr-2" /> Download PDF Report
                </button>
                <button onClick={() => { setVerificationResult(null); setUploadedFile(null); setDescription(''); }} className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl">
                  <Upload className="w-5 h-5 mr-2" /> Verify Another Document
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default DocumentVerification;

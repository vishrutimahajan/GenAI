import React from 'react';
import { motion } from 'framer-motion';

interface ScanningLineProps {
  isScanning: boolean;
}

const ScanningLine: React.FC<ScanningLineProps> = ({ isScanning }) => {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl">
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-lg shadow-green-500/50"
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default ScanningLine;
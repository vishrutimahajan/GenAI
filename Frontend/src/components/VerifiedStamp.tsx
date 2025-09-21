import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface VerifiedStampProps {
  show: boolean;
}

const VerifiedStamp: React.FC<VerifiedStampProps> = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
      className="absolute top-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: 2,
          delay: 1
        }}
      >
        <CheckCircle className="w-8 h-8" />
      </motion.div>
    </motion.div>
  );
};

export default VerifiedStamp;
import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  className = '' 
}) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {count}{suffix}
    </motion.div>
  );
};

export default CountUpAnimation;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      mixBlendMode: 'difference' as const,
    }
  };

  return (
    <motion.div
      className="cursor fixed top-0 left-0 w-8 h-8 bg-blue-500/20 rounded-full pointer-events-none z-50 mix-blend-difference"
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "tween",
        ease: "backOut",
        duration: 0.3
      }}
    />
  );
};

export default AnimatedCursor;
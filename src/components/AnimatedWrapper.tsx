
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'none';
  delay?: number;
  className?: string;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element || animation === 'none') return;
    
    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: animation === 'fadeIn' ? 20 : 0,
      x: animation === 'slideIn' ? 50 : 0,
      scale: animation === 'scaleIn' ? 0.95 : 1,
    });
    
    // Animate to final state
    gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: 0.6,
      delay,
      ease: 'power3.out',
      clearProps: 'all',
    });
    
  }, [animation, delay]);
  
  return (
    <div ref={elementRef} className={cn("w-full", className)}>
      {children}
    </div>
  );
};

export default AnimatedWrapper;

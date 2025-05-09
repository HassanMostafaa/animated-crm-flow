
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

interface PageTransitionOptions {
  duration?: number;
  ease?: string;
  delay?: number;
}

export const usePageTransition = ({
  duration = 0.5,
  ease = 'power2.inOut',
  delay = 0,
}: PageTransitionOptions = {}) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef<string>(location.pathname);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const currentPath = location.pathname;
    
    // Only animate if the path actually changed
    if (prevPathRef.current !== currentPath) {
      // Initial animation - fade out and slide up
      gsap.fromTo(
        container,
        { 
          opacity: 0,
          y: 20,
        },
        { 
          opacity: 1,
          y: 0,
          duration,
          ease,
          delay,
          clearProps: 'all',
        }
      );
      
      prevPathRef.current = currentPath;
    }
  }, [location.pathname, duration, ease, delay]);

  return { ref: containerRef };
};

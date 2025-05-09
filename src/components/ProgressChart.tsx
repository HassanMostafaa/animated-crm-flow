
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ProgressChartProps {
  title: string;
  value: number;
  maxValue: number;
  color?: string;
  delay?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  title, 
  value, 
  maxValue, 
  color = '#4F46E5',
  delay = 0 
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const percentage = Math.round((value / maxValue) * 100);

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    
    if (!container || !progress) return;
    
    // Animate the container
    gsap.fromTo(
      container,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay, ease: 'power2.out' }
    );
    
    // Animate the progress bar
    gsap.fromTo(
      progress,
      { width: '0%' },
      { 
        width: `${percentage}%`, 
        duration: 1.2, 
        delay: delay + 0.3, 
        ease: 'power2.inOut' 
      }
    );
    
  }, [percentage, delay]);

  return (
    <div ref={containerRef} className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          ref={progressRef}
          className="h-full rounded-full" 
          style={{ backgroundColor: color, width: '0%' }}
        ></div>
      </div>
      <div className="mt-1.5 text-xs text-gray-500">
        {value} of {maxValue} complete
      </div>
    </div>
  );
};

export default ProgressChart;

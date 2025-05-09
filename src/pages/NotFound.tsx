
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePageTransition } from '@/hooks/usePageTransition';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { ref } = usePageTransition();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Animate elements
    const tl = gsap.timeline();
    
    tl.fromTo(
      '.not-found-title',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    ).fromTo(
      '.not-found-message',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.3'
    ).fromTo(
      '.not-found-button',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    );
    
  }, [location.pathname]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          <h1 className="text-7xl font-bold text-crm-blue not-found-title">404</h1>
          <p className="text-xl text-gray-600 mt-4 mb-6 not-found-message">
            Oops! We couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="not-found-button">
          <Link to="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

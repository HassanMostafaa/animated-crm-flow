
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { usePageTransition } from '../hooks/usePageTransition';
import { useCrmStore } from '../store/crmStore';
import { Toaster } from '@/components/ui/toaster';

const Layout: React.FC = () => {
  const fetchInitialData = useCrmStore(state => state.fetchInitialData);
  const { ref } = usePageTransition({ duration: 0.4 });

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <div ref={ref} className="h-full">
          <Outlet />
        </div>
        <Toaster />
      </main>
    </div>
  );
};

export default Layout;

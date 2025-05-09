
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart2, Settings, CheckCircle, DollarSign } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 1, icon: <Home size={20} />, label: 'Dashboard', href: '/' },
  { id: 2, icon: <Users size={20} />, label: 'Contacts', href: '/contacts' },
  { id: 3, icon: <DollarSign size={20} />, label: 'Deals', href: '/deals' },
  { id: 4, icon: <CheckCircle size={20} />, label: 'Tasks', href: '/tasks' },
  { id: 5, icon: <BarChart2 size={20} />, label: 'Reports', href: '/reports' },
  { id: 6, icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
];

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }

    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.fromTo(
          item,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, delay: 0.1 + index * 0.1, ease: 'power2.out' }
        );
      }
    });
  }, []);

  return (
    <div ref={sidebarRef} className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-crm-blue">CRM App</h1>
      </div>

      <nav className="flex-1 px-4 pb-6">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={item.id}>
              <Link
                to={item.href}
                ref={el => (itemsRef.current[index] = el)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-crm-blue text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-crm-indigo text-white flex items-center justify-center font-medium">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">Sales Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

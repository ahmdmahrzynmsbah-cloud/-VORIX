import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F0F4F8] print:bg-white text-[#1E293B] font-sans overflow-hidden print:overflow-visible print:h-auto print:block" dir="rtl">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Floating Sidebar wrapper with top, bottom, and right padding */}
      <div className={`fixed inset-y-0 right-0 z-50 p-3 sm:p-4 md:py-4 md:pr-4 md:pl-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} print:hidden flex-shrink-0 flex flex-col`}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 print:block overflow-hidden">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 px-3.5 sm:px-5 md:px-6 pt-3 sm:pt-4 md:pt-4 pb-24 md:pb-6 print:p-0 overflow-y-auto print:overflow-visible print:h-auto space-y-4 sm:space-y-6 print:space-y-0 no-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMore={() => setIsMobileMenuOpen(true)} />
    </div>
  );
}

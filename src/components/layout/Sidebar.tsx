import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  Users, 
  Factory, 
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Download,
  X,
  ChevronRight,
  ChevronLeft,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { useAuth } from '@/src/context/AuthContext';
import { useAppData } from '@/src/context/AppDataContext';
import { useInstallPrompt } from '@/src/hooks/useInstallPrompt';

const navigation = [
  { name: 'لوحة التحكم', to: '/', icon: LayoutDashboard },
  { name: 'الفواتير والمبيعات', to: '/invoices', icon: FileText },
  { name: 'إدارة المخزون', to: '/inventory', icon: Package },
  { name: 'العملاء', to: '/customers', icon: Users },
  { name: 'الموردون', to: '/suppliers', icon: Factory },
  { name: 'سجل المعاملات', to: '/audit-log', icon: History },
  { name: 'الإعدادات', to: '/settings', icon: Settings },
];

export default function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const { logout } = useAuth();
  const { businessProfile } = useAppData();
  const { isInstallable, installApp } = useInstallPrompt();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('dt_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('dt_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <aside 
      className={cn(
        "bg-white text-slate-800 flex flex-col border border-slate-200/90 flex-shrink-0 h-full rounded-3xl overflow-hidden shadow-sm relative print:hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "w-64 md:w-[76px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "border-b border-slate-100 bg-white shrink-0 flex items-center transition-all duration-300",
        isCollapsed ? "p-3 md:py-4 md:px-2 flex-col justify-center gap-2" : "p-4 sm:p-5 justify-between gap-3"
      )}>
        {/* Logo & Name */}
        <div className={cn(
          "flex items-center gap-2.5 overflow-hidden",
          isCollapsed && "md:flex-col md:items-center md:gap-0"
        )}>
          <div 
            onClick={toggleCollapse}
            title={isCollapsed ? "توسيع القائمة" : businessProfile?.name || 'VORIX'}
            className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm"
          >
            <img 
              src={businessProfile?.logo || '/logo.png'} 
              alt={businessProfile?.name || 'VORIX'} 
              className="w-full h-full object-contain rounded-2xl" 
            />
          </div>
          
          <div className={cn("overflow-hidden transition-all duration-200", isCollapsed ? "md:hidden" : "block")}>
            <span className="text-sm font-black tracking-tight truncate block text-slate-900 leading-tight">
              {businessProfile?.name || 'VORIX'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
              نظام إدارة قطع الغيار والمخزون
            </span>
          </div>
        </div>
        
        {/* Toggle and Close Controls */}
        <div className="flex items-center gap-1">
          {/* Desktop Toggle Button */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-[#800020] hover:bg-[#F3E6D5]/40 rounded-xl transition-all cursor-pointer border-none bg-transparent"
            title={isCollapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
            aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button 
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border-none bg-transparent"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={cn(
        "flex-1 py-3 overflow-y-auto no-scrollbar space-y-1.5 transition-all duration-300",
        isCollapsed ? "px-2 md:px-2" : "px-3"
      )}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            title={item.name}
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
            }}
            className={({ isActive }) =>
              cn(
                'group flex items-center transition-all font-bold text-sm rounded-2xl cursor-pointer',
                isCollapsed 
                  ? 'justify-center p-2.5 md:p-2.5' 
                  : 'gap-3 px-3.5 py-2.5',
                isActive
                  ? 'bg-gradient-to-r from-[#800020] to-[#A31535] text-[#F3E6D5] shadow-md shadow-[#800020]/25'
                  : 'text-slate-600 hover:text-[#800020] hover:bg-[#F3E6D5]/35 active:scale-[0.98]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="w-5 h-5 flex items-center justify-center shrink-0" dir="ltr">
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform", 
                      isActive 
                        ? "opacity-100 scale-105 text-[#F3E6D5]" 
                        : "opacity-75 group-hover:opacity-100 group-hover:scale-105 text-slate-500 group-hover:text-[#800020]"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span className={cn(
                  "truncate transition-opacity duration-200", 
                  isCollapsed ? "md:hidden" : "inline-block"
                )}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {isInstallable && (
          <button
            type="button"
            onClick={installApp}
            title="تثبيت التطبيق"
            className={cn(
              "w-full mt-3 flex items-center justify-center bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] rounded-2xl transition-all font-bold shadow-md shadow-[#800020]/20 cursor-pointer text-xs active:scale-[0.98]",
              isCollapsed ? "p-2.5 md:p-2.5" : "gap-2 px-3 py-2.5"
            )}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className={cn(isCollapsed ? "md:hidden" : "inline-block")}>
              تثبيت التطبيق
            </span>
          </button>
        )}
      </nav>

      {/* Footer / User Profile & Credits */}
      <div className={cn(
        "border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2 shrink-0 rounded-b-3xl transition-all duration-300",
        isCollapsed ? "p-2 md:p-2" : "p-3"
      )}>
        {/* User profile card */}
        <div className={cn(
          "flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs transition-all",
          isCollapsed ? "justify-center p-1.5 md:flex-col md:gap-1.5" : "justify-between p-2"
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <div 
              title="مستخدم (مدير النظام)"
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#800020] to-[#A31535] text-[#F3E6D5] font-black flex items-center justify-center text-xs shadow-xs shrink-0 cursor-default"
            >
              م
            </div>
            <div className={cn("min-w-0 transition-opacity duration-200", isCollapsed ? "md:hidden" : "block")}>
              <p className="text-xs font-bold text-slate-900 truncate">مستخدم</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">مدير النظام</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={logout} 
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer p-1.5 flex-shrink-0 rounded-xl transition-colors border-none bg-transparent" 
            title="تسجيل خروج"
            aria-label="تسجيل خروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Developer Branding Widget */}
        <div className={cn(
          "bg-white border border-slate-200/90 rounded-xl text-center shadow-xs transition-all",
          isCollapsed ? "p-1 md:py-1.5" : "px-2.5 py-1.5"
        )}>
          <p className={cn("text-[9px] text-slate-400 font-mono tracking-wider font-semibold", isCollapsed && "md:hidden")}>
            ALL RIGHTS RESERVED © 2026
          </p>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5">
            <a 
              href="https://www.facebook.com/share/1HSRJmLCAn/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#800020] font-bold tracking-wide hover:underline"
              title="Fox Tech Development"
            >
              {isCollapsed ? "FT" : "Fox Tech"}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

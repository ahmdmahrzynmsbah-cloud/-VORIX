import React, { useState } from 'react';
import { Bell, Menu, Cloud, RefreshCw, Check, Clock } from 'lucide-react';
import { useAppData } from '@/src/context/AppDataContext';
import { PWAInstallButton } from '@/src/components/PWAInstallButton';

export default function Header({ onMenuClick, isMobileMenuOpen }: { onMenuClick?: () => void, isMobileMenuOpen?: boolean }) {
  const { notifications, markAllNotificationsRead, syncStatus, syncNow, lastSyncTime, businessProfile } = useAppData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSyncingManual, setIsSyncingManual] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleManualSync = async () => {
    setIsSyncingManual(true);
    await syncNow();
    setTimeout(() => setIsSyncingManual(false), 800);
  };

  return (
    <div className="px-3.5 sm:px-5 md:px-8 pt-3 sm:pt-4 md:pt-5 pb-1 print:hidden shrink-0 z-30">
      <header className="h-14 sm:h-15 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl px-3.5 sm:px-6 flex items-center justify-between shadow-xs transition-all">
        {/* Right Section (Start in RTL) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#800020] hover:bg-[#F3E6D5]/40 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {/* Desktop PWA Install Button */}
          <div className="hidden lg:block shrink-0">
            <PWAInstallButton />
          </div>

          {/* Real-Time Multi-Device Sync Indicator with Click-to-Sync (Desktop) */}
          <button 
            onClick={handleManualSync}
            title="اضغط للتحديث والمزامنة الفورية مع جميع الأجهزة والهواتف"
            className="hidden md:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 text-xs text-emerald-800 rounded-full font-bold transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <Cloud className="w-3.5 h-3.5 text-emerald-700" />
            <span>المزامنة السحابية اللحظية</span>
            <RefreshCw className={`w-3 h-3 text-emerald-700 ${isSyncingManual || syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {lastSyncTime && (
              <span className="text-[10px] text-emerald-900 font-mono">
                ({lastSyncTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
              </span>
            )}
          </button>
        </div>

        {/* Left Section (End in RTL) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile sync status pill with tap-to-sync */}
          <button 
            onClick={handleManualSync}
            title="المزامنة السحابية الفورية"
            className="flex md:hidden items-center gap-1.5 bg-emerald-50 active:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] text-emerald-800 font-bold cursor-pointer shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            <span>متزامن</span>
            <RefreshCw className={`w-3 h-3 text-emerald-700 ${isSyncingManual || syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>

          {/* Notifications Icon and Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="الإشعارات والتنبيهات"
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 active:scale-95 ${
                showNotifications 
                  ? 'bg-gradient-to-r from-[#800020] to-[#A31535] text-[#F3E6D5] border border-[#800020] shadow-md shadow-[#800020]/30' 
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#800020] hover:bg-[#F3E6D5]/40 hover:border-[#800020]/30'
              }`}
              aria-label="الإشعارات والتنبيهات"
            >
              <Bell className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] ${unreadCount > 0 && !showNotifications ? 'text-[#800020]' : ''}`} />
              
              {/* Bold, high-contrast unread notification count badge */}
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#800020] to-[#A31535] text-[#F3E6D5] text-[10px] font-black rounded-full h-4.5 min-w-[18px] px-1 flex items-center justify-center shadow-md border-2 border-white animate-pulse font-mono z-10"
                  dir="ltr"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Invisible overlay for closing dropdown on outside click */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowNotifications(false)} 
                  aria-hidden="true"
                />

                {/* Notification Popup Card */}
                <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-150 text-right">
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-[#F3E6D5]/35">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#800020] text-[#F3E6D5] flex items-center justify-center shadow-xs">
                        <Bell className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">الإشعارات والتنبيهات</h3>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold text-[#800020]">
                            يوجد {unreadCount} إشعار جديد بحاجة للمتابعة
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => {
                          markAllNotificationsRead();
                        }} 
                        className="text-xs font-bold text-[#800020] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3.5 transition-colors flex items-start gap-3 ${
                            !n.read 
                              ? 'bg-[#F3E6D5]/20 border-r-4 border-r-[#800020]' 
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                            !n.read 
                              ? 'bg-[#800020] text-[#F3E6D5]' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs sm:text-sm leading-relaxed ${
                              !n.read 
                                ? 'font-extrabold text-slate-900' 
                                : 'font-medium text-slate-700'
                            }`}>
                              {n.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono" dir="ltr">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{new Date(n.date).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 px-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <p className="text-slate-700 font-bold text-sm">لا توجد إشعارات حالياً</p>
                        <p className="text-slate-400 text-xs mt-1">سيتم إشعارك تلقائياً عند وصول أصناف للحد الحرج أو تسجيل عمليات جديدة</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

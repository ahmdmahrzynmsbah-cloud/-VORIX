import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useAppData } from '@/src/context/AppDataContext';
import { Save, User, Lock, Store, Upload, Check, Printer, Database, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { changePassword } = useAuth();
  const { 
    businessProfile, 
    updateBusinessProfile, 
    inventory, 
    customers, 
    suppliers, 
    invoices, 
    purchases,
    syncStatus,
    lastSyncTime,
    syncNow,
    exportDataBackup,
    importDataBackup,
    scanAndRecoverBrowserData,
    recoveryNotice,
    dismissRecoveryNotice
  } = useAppData();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'backup'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const [scanResult, setScanResult] = useState<{
    recoveredItems: number;
    recoveredCustomers: number;
    recoveredSuppliers: number;
    recoveredInvoices: number;
    recoveredPurchases: number;
    message: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    businessName: businessProfile.name,
    phone: businessProfile.phone,
    address: businessProfile.address,
    description: businessProfile.description || '',
    logo: businessProfile.logo
  });

  useEffect(() => {
    setProfile({
      businessName: businessProfile.name,
      phone: businessProfile.phone,
      address: businessProfile.address,
      description: businessProfile.description || '',
      logo: businessProfile.logo
    });
  }, [businessProfile]);

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name: profile.businessName,
      phone: profile.phone,
      address: profile.address,
      description: profile.description,
      logo: profile.logo
    });
    alert('تم حفظ البيانات بنجاح!');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة!');
      return;
    }
    const result = await changePassword(security.currentPassword, security.newPassword);
    if (!result.success) {
      alert(result.error || 'حدث خطأ أثناء تغيير كلمة المرور!');
      return;
    }
    alert('تم تغيير كلمة المرور بنجاح!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRunDeepScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = scanAndRecoverBrowserData();
      setScanResult(res);
      setIsScanning(false);
    }, 400);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `doctor_tools_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setImportStatusMsg(null);
    try {
      const text = await file.text();
      const res = await importDataBackup(text);
      setImportStatusMsg(res.message);
      if (res.success) {
        syncNow();
      }
    } catch (err: any) {
      setImportStatusMsg(`فشل قراءة الملف: ${err?.message || 'خطأ غير معروف'}`);
    } finally {
      setIsImporting(false);
      if (backupFileInputRef.current) {
        backupFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E293B]">الإعدادات</h2>
        <p className="mt-1 text-sm text-[#475569]">إدارة بيانات النظام وحسابات المستخدمين</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar for settings tabs */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-initial md:w-full flex items-center gap-2.5 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-colors cursor-pointer whitespace-normal md:whitespace-nowrap lg:whitespace-normal text-right ${activeTab === 'profile' ? 'bg-[#800020] text-[#F3E6D5] shadow-md shadow-[#800020]/30' : 'text-[#475569] hover:bg-slate-100'}`}
          >
            <Store className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
            <span>بيانات النظام</span>
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 md:flex-initial md:w-full flex items-center gap-2.5 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-colors cursor-pointer whitespace-normal md:whitespace-nowrap lg:whitespace-normal text-right ${activeTab === 'security' ? 'bg-[#800020] text-[#F3E6D5] shadow-md shadow-[#800020]/30' : 'text-[#475569] hover:bg-slate-100'}`}
          >
            <Lock className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
            <span>تغيير كلمة المرور</span>
          </button>

          <button 
            onClick={() => setActiveTab('backup')}
            className={`flex-1 md:flex-initial md:w-full flex items-center gap-2.5 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-colors cursor-pointer whitespace-normal md:whitespace-nowrap lg:whitespace-normal text-right ${activeTab === 'backup' ? 'bg-[#800020] text-[#F3E6D5] shadow-md shadow-[#800020]/30' : 'text-[#475569] hover:bg-slate-100'}`}
          >
            <Database className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
            <span>النسخ الاحتياطي واستعادة البيانات</span>
          </button>
        </div>

        {/* Setting Content */}
        <div className="flex-1 p-4 md:p-8">
          
          {activeTab === 'profile' && (
            <div className="max-w-xl">
               <h3 className="text-lg font-bold text-[#1E293B] mb-6 border-b border-[#E2E8F0] pb-2">تفاصيل واسم النظام</h3>
               <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">اسم النظام</label>
                    <input 
                      type="text" required
                      value={profile.businessName}
                      onChange={e => setProfile({...profile, businessName: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">رقم هاتف النظام للتواصل (اختياري)</label>
                    <input 
                      type="tel"
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      placeholder="أدخل رقم الهاتف أو اتركه فارغاً..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">العنوان</label>
                    <input 
                      type="text" required
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">السلوجان / وصف النظام (يظهر في صفحة تسجيل الدخول)</label>
                    <input 
                      type="text" required
                      value={profile.description}
                      onChange={e => setProfile({...profile, description: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">الشعار (اللوجو)</label>
                    <div className="mt-2 flex items-center gap-4">
                      {profile.logo ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm">
                          <img src={profile.logo} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-center items-center text-[#800020] ">
                           <Store className="w-6 h-6" />
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 flex items-center gap-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#475569] hover:bg-slate-50 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-4 h-4 text-[#800020]" />
                        تغيير اللوجو
                      </button>
                      
                      {profile.logo && (
                        <button 
                          type="button" 
                          onClick={() => setProfile(prev => ({ ...prev, logo: null }))}
                          className="px-4 py-2 text-sm font-bold text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors border border-transparent hover:border-[#FECACA] cursor-pointer"
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] rounded-xl font-bold shadow-md shadow-[#800020]/25 transition-all cursor-pointer">
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                  </div>
               </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-xl">
               <h3 className="text-lg font-bold text-[#1E293B] mb-6 border-b border-[#E2E8F0] pb-2">كلمة المرور والأمان</h3>
               <form onSubmit={handleSecuritySubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">كلمة المرور الحالية</label>
                    <input 
                      type="password" required
                      value={security.currentPassword}
                      onChange={e => setSecurity({...security, currentPassword: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">كلمة المرور الجديدة</label>
                    <input 
                      type="password" required minLength={6}
                      value={security.newPassword}
                      onChange={e => setSecurity({...security, newPassword: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#475569]">تأكيد كلمة المرور الجديدة</label>
                    <input 
                      type="password" required minLength={6}
                      value={security.confirmPassword}
                      onChange={e => setSecurity({...security, confirmPassword: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#800020] focus:outline-none text-right bg-white" dir="auto"
                    />
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] rounded-xl font-bold shadow-md shadow-[#800020]/25 transition-all cursor-pointer">
                      <Save className="w-4 h-4" />
                      تحديث كلمة المرور
                    </button>
                  </div>
               </form>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="max-w-3xl space-y-6">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="text-lg font-bold text-[#1E293B]">مركز النسخ الاحتياطي واستعادة البيانات</h3>
                <p className="text-xs sm:text-sm text-[#475569] mt-1">
                  استرجاع البيانات المحفوظة محلياً، فحص ذاكرة المتصفح، تنزيل نسخة احتياطية على جهازك، والمزامنة السحابية.
                </p>
              </div>

              {/* Data Summary & Cloud Status Card */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#1E293B]">حالة السجلات المحملة في النظام</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      آخر مزامنة: {lastSyncTime ? lastSyncTime.toLocaleTimeString('ar-EG') : 'الآن'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${syncStatus === 'synced' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                      <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-[#16a34a]' : 'bg-[#d97706] animate-ping'}`} />
                      {syncStatus === 'synced' ? 'المزامنة السحابية نشطة' : 'جاري المزامنة...'}
                    </span>
                    <button
                      type="button"
                      onClick={() => syncNow()}
                      className="p-1.5 rounded-lg border border-[#CBD5E1]  text-[#475569]  hover:bg-slate-50  transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="مزامنة فورية"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      تحديث
                    </button>
                  </div>
                </div>

                {/* Counts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-xs text-[#64748B] block">المنتجات</span>
                    <span className="text-lg font-bold text-[#1E293B] mt-0.5 block">{inventory.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-xs text-[#64748B] block">العملاء</span>
                    <span className="text-lg font-bold text-[#1E293B] mt-0.5 block">{customers.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-xs text-[#64748B] block">الموردون</span>
                    <span className="text-lg font-bold text-[#1E293B] mt-0.5 block">{suppliers.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-xs text-[#64748B] block">فواتير البيع</span>
                    <span className="text-lg font-bold text-[#1E293B] mt-0.5 block">{invoices.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-xs text-[#64748B] block">أذون الشراء</span>
                    <span className="text-lg font-bold text-[#1E293B] mt-0.5 block">{purchases.length}</span>
                  </div>
                </div>
              </div>

              {/* Action 1: Deep Browser Scan & Recovery */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-50 text-[#800020]  rounded-xl shrink-0 border border-slate-200">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-[#1E293B]">1. فحص واسترجاع البيانات من ذاكرة المتصفح (Deep Storage Scan)</h4>
                    <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                      يفحص هذا الخيار جميع مساحات التخزين المؤقت والاحتياطي بالمتصفح، ويستعيد أي بيانات سابقة (أصناف، عملاء، فواتير) ويقوم بمزامنتها تلقائياً مع قاعدة البيانات السحابية حتى لا تفقدها مجدداً.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRunDeepScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-[#800020]/25 text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'جاري فحص ذاكرة المتصفح...' : 'بدء فحص واستعادة البيانات الآن'}
                  </button>
                </div>

                {scanResult && (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${scanResult.recoveredItems + scanResult.recoveredCustomers + scanResult.recoveredSuppliers + scanResult.recoveredInvoices + scanResult.recoveredPurchases > 0 ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' : 'bg-slate-50 border-slate-200 text-[#800020] '}`}>
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{scanResult.message}</p>
                      {(scanResult.recoveredItems > 0 || scanResult.recoveredCustomers > 0 || scanResult.recoveredInvoices > 0) && (
                        <div className="text-xs mt-1.5 space-x-3 space-x-reverse font-medium">
                          {scanResult.recoveredItems > 0 && <span>• {scanResult.recoveredItems} صنف</span>}
                          {scanResult.recoveredCustomers > 0 && <span>• {scanResult.recoveredCustomers} عميل</span>}
                          {scanResult.recoveredSuppliers > 0 && <span>• {scanResult.recoveredSuppliers} مورد</span>}
                          {scanResult.recoveredInvoices > 0 && <span>• {scanResult.recoveredInvoices} فاتورة</span>}
                          {scanResult.recoveredPurchases > 0 && <span>• {scanResult.recoveredPurchases} إذن شراء</span>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action 2: Export Data Backup */}
              <div className="border border-[#CBD5E1] rounded-2xl p-5 bg-white space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#F0FDF4] text-[#16A34A] rounded-xl shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-[#1E293B]">2. تحميل نسخة احتياطية لجهازك (Export JSON)</h4>
                    <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                      قم بتنزيل ملف يحتوي على كامل بياناتك الحالية (المنتجات، العملاء، الموردين، الفواتير، والإعدادات) والاحتفاظ به على جهاز الكمبيوتر أو الهاتف بأمان تام للرجوع إليه أو استعادته في أي وقت.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-[#15803D] transition-colors cursor-pointer shadow-sm text-sm"
                  >
                    <Download className="w-4 h-4" />
                    تحميل ملف النسخة الاحتياطية الكاملة (JSON)
                  </button>
                </div>
              </div>

              {/* Action 3: Import Data Backup */}
              <div className="border border-[#CBD5E1] rounded-2xl p-5 bg-white space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#FEF3C7] text-[#D97706] rounded-xl shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-[#1E293B]">3. استيراد واستعادة من ملف نسخة احتياطية (Import JSON)</h4>
                    <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                      إذا كان لديك ملف نسخة احتياطية قمت بتنزيله سابقاً، اختر الملف هنا لاسترجاع كافة البيانات ومزامنتها فوراً مع النظام والسحابة.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    type="file"
                    ref={backupFileInputRef}
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backupFileInputRef.current?.click()}
                    disabled={isImporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#CBD5E1] text-[#334155] rounded-xl font-bold hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-colors cursor-pointer text-sm"
                  >
                    <Upload className="w-4 h-4 text-[#D97706]" />
                    {isImporting ? 'جاري استيراد البيانات...' : 'اختيار ملف نسخة احتياطية (.json)'}
                  </button>
                </div>

                {importStatusMsg && (
                  <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-sm text-[#166534] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{importStatusMsg}</span>
                  </div>
                )}
              </div>

              {/* Helpful Tips Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#800020] ">
                  <AlertCircle className="w-4 h-4 text-[#800020]" />
                  <span>تلميحات هامة لضمان سلامة بياناتك:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#475569]">
                  <li>إذا كنت قد قمت بتسجيل البيانات من متصفح آخر أو نافذة خفية (Incognito) أو رابط مختلف، افتح الرابط في ذلك المتصفح ثم حمّل نسخة احتياطية واستوردها هنا.</li>
                  <li>جميع البيانات التي تضيفها يتم حفظها الآن تلقائياً في ذاكرة المتصفح الأساسية والاحتياطية معاً، ومزامنتها سحابياً.</li>
                  <li>يُنصح دائماً بتحميل نسخة احتياطية أسبوعية من زر التحميل أعلاه لحفظها على جهازك.</li>
                </ul>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { useAppData } from '@/src/context/AppDataContext';
import { Package, FileText, ArrowUpRight, TrendingDown, Wallet, CreditCard, AlertTriangle, ArrowLeft, CheckCircle2, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { inventory, invoices, customers, businessProfile, recoveryNotice, dismissRecoveryNotice } = useAppData();

  const customerMap = useMemo(() => {
    const map = new Map<string, string>();
    customers.forEach(c => map.set(c.id, c.name));
    return map;
  }, [customers]);

  const { todaySales, todayDebt, todayCash, allTimeDebt, lowStockCount, recentInvoices } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    let sales = 0;
    let debt = 0;
    let cash = 0;

    for (let i = 0; i < invoices.length; i++) {
      const inv = invoices[i];
      if (inv.date && inv.date.startsWith(todayStr)) {
        sales += inv.total || 0;
        debt += ((inv.total || 0) - (inv.paid || 0));
        cash += inv.paid || 0;
      }
    }
    
    let totalCustomerDebt = 0;
    for (let i = 0; i < customers.length; i++) {
      totalCustomerDebt += customers[i].balance || 0;
    }

    let lowStock = 0;
    for (let i = 0; i < inventory.length; i++) {
      if ((inventory[i].quantity || 0) <= 5) lowStock++;
    }

    const recent = invoices.slice(0, 5);

    return {
      todaySales: sales,
      todayDebt: debt,
      todayCash: cash,
      allTimeDebt: totalCustomerDebt,
      lowStockCount: lowStock,
      recentInvoices: recent
    };
  }, [invoices, customers, inventory]);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="text-right mb-6 md:mb-0 w-full md:w-auto">
           <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1.5 flex items-center justify-start gap-2">
              مرحباً بك، admin
           </h2>
           <p className="text-slate-500 text-sm md:text-base font-medium">{businessProfile?.description || 'نظام إدارة قطع الغيار والمخزون والمبيعات المتكامل'}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <Link to="/inventory" className="flex-1 md:flex-none justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center gap-2 transition-all">
               <Package className="w-4 h-4 text-slate-600"/> المستودع
           </Link>
           <Link to="/invoices" className="flex-1 md:flex-none justify-center bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] font-bold py-2.5 px-5 rounded-2xl shadow-md shadow-[#800020]/25 text-xs flex items-center gap-2 transition-all">
               <FileText className="w-4 h-4"/> + فاتورة بيع جديدة
           </Link>
        </div>
      </div>

      {/* Recovery Notice if an action was executed */}
      {recoveryNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-emerald-900 text-sm">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{recoveryNotice}</span>
          </div>
          <button
            onClick={() => dismissRecoveryNotice()}
            className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-xl cursor-pointer transition-colors"
            title="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards Grid - 1-col on mobile, 2-col on sm, 3-col on md/lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        
        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between min-h-[120px] sm:min-h-[140px]">
           <div>
             <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2">القطع بالمستودع</h3>
             <p className="text-2xl sm:text-3xl font-black text-slate-900">{inventory.length}</p>
           </div>
           <div className="w-12 h-12 bg-[#F3E6D5]/60 text-[#800020] border border-[#800020]/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs" dir="ltr">
             <Package className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between min-h-[120px] sm:min-h-[140px]">
           <div>
             <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2 whitespace-nowrap">مبيعات اليوم <span className="text-[10px] sm:text-xs font-normal text-slate-400">(الإجمالي)</span></h3>
             <p className="text-2xl sm:text-3xl font-black text-emerald-600">{todaySales} <span className="text-xs sm:text-sm font-bold text-slate-400">ج.م</span></p>
           </div>
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs" dir="ltr">
             <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between min-h-[120px] sm:min-h-[140px]">
           <div>
             <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2 whitespace-nowrap">الديون المعلقة <span className="text-[10px] sm:text-xs font-normal text-slate-400">(اليوم)</span></h3>
             <p className="text-2xl sm:text-3xl font-black text-amber-600">{todayDebt} <span className="text-xs sm:text-sm font-bold text-slate-400">ج.م</span></p>
           </div>
           <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-100/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs" dir="ltr">
             <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
           <div className="flex items-center justify-between w-full">
             <div>
               <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2">الموجود في الدرج</h3>
               <p className="text-2xl sm:text-3xl font-black text-[#800020]">{todayCash} <span className="text-xs sm:text-sm font-bold text-slate-400">ج.م</span></p>
             </div>
             <div className="w-12 h-12 bg-[#F3E6D5]/60 text-[#800020] border border-[#800020]/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs" dir="ltr">
               <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
             </div>
           </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 border-t border-slate-100 pt-2.5 mt-2 w-full text-center">المبيعات الكاش - المصروفات: {todayCash} ج.م</p>
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between min-h-[120px] sm:min-h-[140px]">
           <div>
             <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2">الديون بكل الأيام</h3>
             <p className="text-2xl sm:text-3xl font-black text-rose-600">{allTimeDebt} <span className="text-xs sm:text-sm font-bold text-slate-400">ج.م</span></p>
           </div>
           <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-100/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs" dir="ltr">
             <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
        </div>

        <div className="bg-white p-5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between min-h-[120px] sm:min-h-[140px] relative overflow-hidden">
           <div>
             <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2">أوشكت على النفاذ</h3>
             <p className={`text-2xl sm:text-3xl font-black ${lowStockCount > 0 ? "text-rose-600" : "text-amber-600"}`}>{lowStockCount}</p>
           </div>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 shadow-xs ${lowStockCount > 0 ? "bg-rose-50 text-rose-600 border border-rose-100/80" : "bg-amber-50 text-amber-600 border border-amber-100/80"}`} dir="ltr">
             <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
           </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
         
         <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 flex justify-between items-center border-b border-slate-100 bg-[#FAF7F2]/60 gap-3">
               <div className="flex items-center gap-2.5">
                 <div className="w-10 h-10 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shadow-xs">
                   <FileText className="w-5 h-5 stroke-[2.2]" />
                 </div>
                 <div>
                   <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                     آخر الفواتير الصادرة
                   </h3>
                   <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                     {recentInvoices.length > 0 
                       ? `أحدث ${recentInvoices.length} فواتير بيع مسجلة` 
                       : "سجل فواتير البيع الأخيرة"}
                   </p>
                 </div>
               </div>

               <div className="flex items-center gap-2">
                 <Link 
                   to="/invoices" 
                   className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3E6D5]/40 text-[#800020] border border-[#800020]/25 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                 >
                   <span>عرض المبيعات</span>
                   <ArrowLeft className="w-3.5 h-3.5" />
                 </Link>
               </div>
            </div>

            {/* Mobile View: Recent Invoices Cards */}
            <div className="block md:hidden p-3.5 space-y-2.5">
              {recentInvoices.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F3E6D5]/50 border border-[#800020]/15 text-[#800020] flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <FileText className="w-7 h-7 stroke-[1.8]" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">لا توجد فواتير صادرة مؤخراً</h4>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                    لم يتم تسجيل أي فواتير بيع بعد. يمكنك البدء بإصدار أول فاتورة للعميل من صفحة المبيعات.
                  </p>
                  <Link
                    to="/invoices"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#800020] hover:bg-[#660019] text-[#F3E6D5] rounded-xl text-xs font-bold shadow-md shadow-[#800020]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    إصدار فاتورة بيع جديدة
                  </Link>
                </div>
              ) : (
                recentInvoices.map((inv, idx) => {
                  const customerName = inv.customCustomerName || customerMap.get(inv.customerId) || "عميل نقدي";
                  const isFullyPaid = inv.paid >= inv.total;
                  const isPartiallyPaid = inv.paid > 0 && inv.paid < inv.total;
                  const dateStr = new Date(inv.date);
                  const formattedDate = `${dateStr.getDate().toString().padStart(2, "0")}/${(dateStr.getMonth()+1).toString().padStart(2, "0")}/${dateStr.getFullYear()}`;

                  return (
                    <div 
                      key={inv.id ? `recent-inv-${inv.id}` : `recent-inv-idx-${idx}`}
                      className="bg-[#FAF7F2]/40 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-xs font-black text-[#800020]">
                            SA-{inv.invoiceNumber}
                          </span>
                          {isFullyPaid ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">نقدي</span>
                          ) : isPartiallyPaid ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">جزئي</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold">آجل</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-1">
                          {customerName}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formattedDate}
                        </span>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="font-black text-sm text-slate-900 font-mono block">
                          {Number(inv.total || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">ج.م</span>
                        </span>
                        <Link 
                          to="/invoices" 
                          className="text-[11px] font-bold text-[#800020] hover:underline"
                        >
                          عرض
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Clean Daylight Table */}
            <div className="hidden md:block overflow-x-auto flex-1">
               <table className="w-full text-sm text-right">
                  <thead className="bg-[#F8FAFC] text-slate-700 border-b border-slate-200">
                     <tr>
                        <th className="py-3.5 px-6 font-bold text-xs whitespace-nowrap text-slate-700">رقم الفاتورة</th>
                        <th className="py-3.5 px-6 font-bold text-xs whitespace-nowrap text-slate-700">اسم العميل</th>
                        <th className="py-3.5 px-6 font-bold text-xs whitespace-nowrap text-slate-700">التاريخ والوقت</th>
                        <th className="py-3.5 px-6 font-bold text-xs text-center whitespace-nowrap text-slate-700">طريقة الدفع</th>
                        <th className="py-3.5 px-6 font-bold text-xs text-left whitespace-nowrap text-slate-700">المبلغ الإجمالي</th>
                     </tr>
                  </thead>
                   <tbody className="divide-y divide-slate-100">
                     {recentInvoices.map((inv, idx) => {
                       const customerName = inv.customCustomerName || customerMap.get(inv.customerId) || "عميل نقدي";
                       const isFullyPaid = inv.paid >= inv.total;
                       const isPartiallyPaid = inv.paid > 0 && inv.paid < inv.total;
                       const dateStr = new Date(inv.date);
                       
                       const formattedDate = `${dateStr.getHours().toString().padStart(2, "0")}:${dateStr.getMinutes().toString().padStart(2, "0")} ${dateStr.getDate().toString().padStart(2, "0")}/${(dateStr.getMonth()+1).toString().padStart(2, "0")}/${dateStr.getFullYear()}`;

                       return (
                         <tr key={inv.id ? `recent-inv-${inv.id}` : `recent-inv-idx-${idx}`} className="hover:bg-[#FAF7F2]/50 transition-colors">
                           <td className="py-4 px-6 font-black text-[#800020] font-mono">SA-{inv.invoiceNumber}</td>
                           <td className="py-4 px-6 font-bold text-slate-900">{customerName}</td>
                           <td className="py-4 px-6 text-slate-500 font-mono text-xs text-right" dir="ltr">{formattedDate}</td>
                           <td className="py-4 px-6 text-center">
                             {isFullyPaid ? (
                               <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                 نقدي
                               </span>
                             ) : isPartiallyPaid ? (
                               <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                 جزئي
                               </span>
                             ) : (
                               <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                 آجل
                               </span>
                             )}
                           </td>
                           <td className="py-4 px-6 font-black text-slate-900 text-left font-mono text-base">
                             {Number(inv.total || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">ج.م</span>
                           </td>
                         </tr>
                       );
                     })}
                     {recentInvoices.length === 0 && (
                       <tr>
                         <td colSpan={5} className="py-14 px-4 text-center">
                           <div className="w-14 h-14 rounded-2xl bg-[#F3E6D5]/50 border border-[#800020]/15 text-[#800020] flex items-center justify-center mx-auto mb-3 shadow-xs">
                             <FileText className="w-7 h-7 stroke-[1.8]" />
                           </div>
                           <h4 className="font-extrabold text-slate-800 text-sm">لا توجد فواتير صادرة مؤخراً</h4>
                           <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                             لم يتم تسجيل أي فواتير بيع بعد. يمكنك البدء بإصدار أول فاتورة للعميل من شاشة المبيعات.
                           </p>
                           <Link
                             to="/invoices"
                             className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#800020] hover:bg-[#660019] text-[#F3E6D5] rounded-xl text-xs font-bold shadow-md shadow-[#800020]/20 transition-all cursor-pointer"
                           >
                             <Plus className="w-4 h-4" />
                             إصدار فاتورة بيع جديدة
                           </Link>
                         </td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden text-center col-span-1">
            <div className="absolute top-6 left-6 text-amber-500">
               <div className="w-9 h-9 bg-amber-50 border border-amber-100/80 rounded-2xl flex items-center justify-center text-amber-600 shadow-xs" dir="ltr">
                  <AlertTriangle className="w-5 h-5" />
               </div>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 mb-2 absolute top-6 right-6">تنبيهات المخزون<br/> الحرج</h3>
            
            <div className={`mt-10 w-24 h-24 ${lowStockCount > 0 ? "bg-rose-50 text-rose-600 border border-rose-100/80" : "bg-amber-50 text-amber-600 border border-amber-100/80"} rounded-3xl flex flex-col items-center justify-center mb-6 shadow-xs`}>
               <span className="text-3xl font-black">{lowStockCount}</span>
               <span className="text-xs font-bold">قطع</span>
            </div>
            
            {lowStockCount === 0 ? (
               <p className="text-center text-slate-400 text-sm font-bold px-2">
                 جميع السلع متوفرة بكمية ممتازة (أعلى من 5 حبات).
               </p>
            ) : (
               <p className="text-center text-rose-600 text-sm font-bold px-2">
                 يوجد {lowStockCount} قطع قاربت على النفاذ بالمستودع وتحتاج للطلب فوراً.
               </p>
            )}
         </div>

      </div>

    </div>
  );
}

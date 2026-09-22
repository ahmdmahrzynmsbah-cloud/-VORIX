import React, { useMemo } from 'react';
import { useAppData } from '@/src/context/AppDataContext';
import { History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function AuditLog() {
 const { invoices, purchases, customers, suppliers } = useAppData();

 const transactions = useMemo(() => {
 const list = [];
 
 // Invoices (Sales)
 for (const inv of invoices) {
 const c = customers.find(x => x.id === inv.customerId);
 list.push({
 id: `INV-${inv.id}`,
 type: 'sale',
 title: `فاتورة بيع صادرة رقم ${inv.invoiceNumber}`,
 entity: c?.name || 'عميل محذوف',
 date: new Date(inv.date),
 total: inv.total,
 paid: inv.paid
 });
 }

 // Purchases
 for (const pur of purchases) {
 const s = suppliers.find(x => x.id === pur.supplierId);
 list.push({
 id: `PUR-${pur.id}`,
 type: 'purchase',
 title: 'عملية توريد / شراء',
 entity: s?.name || 'مورد محذوف',
 date: new Date(pur.date),
 total: pur.total,
 paid: pur.paid
 });
 }

 // Sort descending
 return list.sort((a, b) => b.date.getTime() - a.date.getTime());
 }, [invoices, purchases, customers, suppliers]);

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold text-[#1E293B]">سجل المعاملات</h2>
 <p className="mt-1 text-sm text-[#475569]">سجل زمني لجميع عمليات البيع والشراء التي تمت على النظام</p>
 </div>

 <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col p-6 sm:p-7">
 <div className="space-y-4">
 {transactions.length === 0 ? (
 <div className="text-center text-slate-400 py-12 flex flex-col items-center">
 <History className="w-12 h-12 mb-3 opacity-20" />
 <p>لا توجد معاملات مسجلة حتى الآن</p>
 </div>
 ) : (
 transactions.map((tx, idx) => (
 <div key={tx.id ? `audit-${tx.id}` : `audit-idx-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#800020]/40 transition-colors">
 <div className="flex items-start gap-4">
 <div className={`mt-1 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 min-w-[40px] shadow-xs ${tx.type === 'sale' ? 'bg-[#F3E6D5]/60 text-[#800020] border border-[#800020]/20 ' : 'bg-rose-50 text-rose-600 border border-rose-100'}`} dir="ltr">
 {tx.type === 'sale' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
 </div>
 <div>
 <h4 className="font-extrabold text-slate-900">{tx.title}</h4>
 <p className="text-sm font-bold text-slate-600 mt-1">{tx.entity}</p>
 <p className="text-xs text-slate-400 mt-1 font-mono" dir="ltr">{tx.date.toLocaleString('ar-EG')}</p>
 </div>
 </div>
 
 <div className="mt-4 sm:mt-0 text-right">
 <p className="text-sm text-slate-600 font-bold">الإجمالي: <span className="text-slate-900 font-black font-mono" dir="ltr">{Number(tx.total || 0).toLocaleString()}</span> ج.م</p>
 <p className="text-sm text-slate-600 font-bold mt-1">
 المدفوع كاش: 
 <span className={`font-mono font-bold ${tx.paid >= tx.total ? 'text-emerald-600' : (tx.paid === 0 ? 'text-rose-600' : 'text-amber-600')}`} dir="ltr"> {Number(tx.paid || 0).toLocaleString()}</span> ج.م
 </p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 );
}

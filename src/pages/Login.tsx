import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { businessProfile } = useAppData();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError('');
    
    if (!password) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setIsLoading(true);
    const result = await login(password);
    setIsLoading(false);

    if (!result.success && result.error) {
      setError(result.error);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between p-4 py-6 font-cairo" dir="rtl">
      <div className="w-full flex-1 flex items-center justify-center py-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 relative overflow-hidden border border-slate-200">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#800020] via-[#A31535] to-[#800020]"></div>
          
          <div className="flex flex-col items-center justify-center text-center mt-6 mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-sm overflow-hidden">
              <img src={businessProfile?.logo || '/logo.png'} alt={businessProfile?.name || 'VORIX'} className="w-full h-full object-contain rounded-3xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{businessProfile?.name || 'VORIX'}</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">{businessProfile?.description || 'نظام إدارة قطع الغيار والمخزون والمبيعات المتكامل'}</p>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 mb-6">
            <p className="text-[#800020] font-bold text-center mb-4 text-sm">تسجيل الدخول للموظفين والإدارة</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e as any);
                    }
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#800020] focus:outline-none text-slate-900 transition-all"
                  placeholder="أدخل كلمة المرور (admin)..."
                />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#800020] to-[#A31535] hover:from-[#660019] hover:to-[#800020] text-[#F3E6D5] font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#800020]/25"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
                ) : (
                   <span>دخول النظام</span>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <p className="text-rose-600 text-sm font-bold">{error}</p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="text-center w-full text-[#94A3B8] text-xs font-medium py-2">
        © 2026 {businessProfile?.name || 'VORIX'} - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

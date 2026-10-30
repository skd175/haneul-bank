import React, { useState } from 'react';
import { 
  ArrowRightLeft, Gift, QrCode, Sparkles, Users, FileText, 
  MoreHorizontal, Bell, Send, Download, Home, CreditCard, 
  Compass, HelpCircle, User, ShieldAlert, Building, CheckCircle2, PlusCircle
} from 'lucide-react';

type Tab = 'home' | 'payment' | 'lifestyle' | 'help' | 'me' | 'transfer';

interface UserAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
}

const INITIAL_USERS: UserAccount[] = [
  { id: 'usr-1', name: '김하늘 (Haneul Kim)', accountNumber: '1003006542', balance: 14820500 },
  { id: 'usr-2', name: '박지성 (Jisung Park)', accountNumber: '1003889102', balance: 3500000 },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUserIdx, setCurrentUserIdx] = useState<number>(0);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Admin funding state
  const [fundUserId, setFundUserId] = useState<string>(INITIAL_USERS[0].id);
  const [fundAmount, setFundAmount] = useState<string>('');

  // Transfer state
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferDest, setTransferDest] = useState<string>('');
  const [transferStep, setTransferStep] = useState<'input' | 'success'>('input');

  const activeUser = users[currentUserIdx];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const formatKRW = (amt: number) => '₩' + amt.toLocaleString('ko-KR');

  const handleAdminFund = () => {
    const amt = Number(fundAmount);
    if (!amt || amt <= 0) {
      showToast('올바른 금액을 입력하세요.');
      return;
    }
    setUsers(prev => prev.map(u => u.id === fundUserId ? { ...u, balance: u.balance + amt } : u));
    showToast(`성공적으로 ${formatKRW(amt)}을 충전했습니다.`);
    setFundAmount('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-24 antialiased">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Top Bar with Admin Link */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">하</div>
          <span className="font-extrabold text-slate-800 tracking-tight">HANEUL BANK</span>
        </div>
        <button 
          onClick={() => setCurrentTab('admin')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> 관리자 센터
        </button>
      </div>

      {/* --- HOME VIEW (Exact Match to Screenshot) --- */}
      {currentTab === 'home' && (
        <main className="max-w-md mx-auto p-4 space-y-6">
          
          {/* Main Balance Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6 relative overflow-hidden">
            
            {/* Top row of card */}
            <div className="flex justify-between items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <span>Personal - {activeUser.accountNumber}</span>
              </div>
              <button onClick={() => showToast('알림 내역이 없습니다.')} className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                <Bell className="w-5 h-5" />
              </button>
            </div>

            {/* Balance & Logo */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Balance</span>
                <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-slate-400 hover:text-slate-600">
                  👁️
                </button>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {balanceVisible ? formatKRW(activeUser.balance) : '₩ **********'}
                </h1>
                <div className="text-right">
                  <span className="text-xl font-black tracking-tighter text-emerald-500 bg-emerald-50 px-3 py-1 rounded-xl">하늘은행</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setCurrentTab('transfer')}
                className="py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Money
              </button>
              <button 
                onClick={() => showToast('요청 링크가 클립보드에 복사되었습니다.')}
                className="py-3.5 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-600 font-bold text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Request Money
              </button>
            </div>

          </div>

          {/* Action Grid Section ("What do you want to do today?") */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-amber-600 tracking-wide px-1">What do you want to do today?</p>
            
            <div className="grid grid-cols-4 gap-3">
              
              {/* Activities */}
              <button onClick={() => showToast('거래 내역 페이지')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Activities</span>
              </button>

              {/* Referral */}
              <button onClick={() => showToast('친구 초대 이벤트')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Referral</span>
              </button>

              {/* QR */}
              <button onClick={() => showToast('QR 코드 스캐너 열림')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">QR</span>
              </button>

              {/* Ask Indy (Highlighted Green Card) */}
              <button onClick={() => showToast('AI 비서 하늘이가 답변합니다.')} className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center gap-2 text-white hover:bg-emerald-600 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Ask Indy</span>
              </button>

              {/* Bulk */}
              <button onClick={() => showToast('일괄 송금 기능')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Bulk</span>
              </button>

              {/* Bills */}
              <button onClick={() => showToast('공과금 납부')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Bills</span>
              </button>

              {/* More */}
              <button onClick={() => showToast('더보기 메뉴')} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-emerald-600">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">More</span>
              </button>

            </div>
          </div>

          {/* Promotional Banner Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="space-y-3 max-w-[200px]">
              <p className="text-sm font-extrabold leading-snug">
                The best thing about Haneul? Telling someone about it.
              </p>
              <button onClick={() => showToast('초대 링크 복사됨!')} className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-900 text-xs font-black">
                Invite a friend
              </button>
            </div>
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-200 to-emerald-400 flex items-center justify-center text-slate-900 font-black text-center p-2 text-xs shadow-inner">
              ✨ 프리미엄 모바일 금융
            </div>
          </div>

        </main>
      )}

      {/* --- TRANSFER VIEW --- */}
      {currentTab === 'transfer' && (
        <main className="max-w-md mx-auto p-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">Send Money (간편 송금)</h2>
              <button onClick={() => setCurrentTab('home')} className="text-xs font-bold text-emerald-600">닫기</button>
            </div>

            {transferStep === 'input' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">받는 계좌 번호</label>
                  <input 
                    type="text" 
                    placeholder="계좌번호 입력" 
                    value={transferDest}
                    onChange={(e) => setTransferDest(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">보낼 금액 (KRW)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-lg font-black focus:outline-emerald-500"
                  />
                </div>
                <button 
                  onClick={() => {
                    const amt = Number(transferAmount);
                    if (!amt || amt <= 0) { showToast('금액을 올바르게 입력해주세요.'); return; }
                    if (amt > activeUser.balance) { showToast('잔액이 부족합니다.'); return; }
                    setUsers(prev => prev.map((u, idx) => idx === currentUserIdx ? { ...u, balance: u.balance - amt } : u));
                    setTransferStep('success');
                  }}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                  송금 완료하기
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-xl font-extrabold">송금이 성공했습니다!</h3>
                <button 
                  onClick={() => { setTransferStep('input'); setTransferAmount(''); setCurrentTab('home'); }}
                  className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                >
                  홈으로 돌아가기
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* --- ADMIN CENTER VIEW --- */}
      {window.location.pathname === '/haneul-admin' && (
        <main className="max-w-md mx-auto p-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-extrabold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> 관리자 자금 충전
              </h2>
              <button onClick={() => setCurrentTab('home')} className="text-xs font-bold text-slate-400">돌아가기</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">충전할 고객 선택</label>
                <select 
                  value={fundUserId} 
                  onChange={(e) => setFundUserId(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-bold text-white"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.accountNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">충전 금액 (KRW)</label>
                <input 
                  type="number" 
                  placeholder="예: 1000000" 
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-bold text-white"
                />
              </div>

              <button 
                onClick={handleAdminFund}
                className="w-full py-4 rounded-2xl bg-amber-400 text-slate-900 font-black text-sm shadow-lg shadow-amber-400/20"
              >
                즉시 계좌 잔액 충전
              </button>
            </div>

            {/* List of accounts */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-400">등록된 계좌 목록</p>
              {users.map((u, idx) => (
                <div key={u.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl text-xs">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-slate-400 font-mono">{u.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400">{formatKRW(u.balance)}</p>
                    <button 
                      onClick={() => { setCurrentUserIdx(idx); setCurrentTab('home'); showToast(`${u.name} 계좌로 전환됨`); }}
                      className="text-[10px] text-amber-400 underline mt-0.5"
                    >
                      보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* --- FIXED BOTTOM NAVIGATION (Exact Match to Screenshot Footer) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-45 shadow-2xl max-w-md mx-auto rounded-t-3xl">
        
        {/* Home */}
        <button onClick={() => setCurrentTab('home')} className={`flex flex-col items-center gap-1 ${currentTab === 'home' ? 'text-emerald-500 font-extrabold' : 'text-slate-400 font-medium'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Payment */}
        <button onClick={() => { setCurrentTab('transfer'); }} className={`flex flex-col items-center gap-1 ${currentTab === 'transfer' ? 'text-emerald-500 font-extrabold' : 'text-slate-400 font-medium'}`}>
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">Payment</span>
        </button>

        {/* Lifestyle */}
        <button onClick={() => showToast('라이프스타일 메뉴')} className="flex flex-col items-center gap-1 text-slate-400 font-medium">
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Lifestyle</span>
        </button>

        {/* Help */}
        <button onClick={() => showToast('고객센터 연결: 1644-0000')} className="flex flex-col items-center gap-1 text-slate-400 font-medium">
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px]">Help</span>
        </button>

        {/* Me */}
        <button onClick={() => setCurrentTab('admin')} className="flex flex-col items-center gap-1 text-slate-400 font-medium">
          <User className="w-5 h-5" />
          <span className="text-[10px]">Me</span>
        </button>

      </nav>

    </div>
  );
}


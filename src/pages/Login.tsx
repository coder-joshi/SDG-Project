import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoadingAuth, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => { if (!isLoadingAuth && currentUser) navigate('/dashboard', { replace: true }); }, [isLoadingAuth, currentUser, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const user = await login(email, password);
    if (!user) {
      setError('Email or password is incorrect. Use one of the demo accounts shown below.');
      return;
    }
    navigate(user.role === 'verifier' ? '/verifier/queue' : user.role === 'corporate' ? '/marketplace' : '/dashboard');
  };

  return <div className="min-h-screen bg-[#F4FAF6] flex items-center justify-center p-4">
    <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-7 shadow-xl sm:p-9">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ArrowLeft className="h-4 w-4" /> Back to GreenLedger</Link>
      <div className="mt-7 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-white"><Leaf /></div><div><p className="text-xl font-extrabold">GreenLedger India</p><p className="text-sm text-slate-500">Sign in to your role based workspace</p></div></div>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Email<input required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="you@example.com" /></label>
        <label className="block text-sm font-semibold text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" placeholder="Password" /></label>
        {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 font-bold text-white hover:bg-emerald-800"><LockKeyhole className="h-4 w-4" /> Sign in</button>
      </form>
      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-950"><strong>Demo access</strong><br/>Password for all demo users: <code>GreenLedger2026!</code><br/><span className="break-all">aarav.sharma@greenindia.org · sunita.rao@moefcc.gov.in · vikram.mehta@tatasteel.com</span><br/><span className="text-emerald-800">Your account role is assigned by the registry and controls available pages.</span></div>
      <p className="mt-5 text-center text-xs text-slate-400">GreenLedger demo · credentials are local only</p>
    </div>
  </div>;
};

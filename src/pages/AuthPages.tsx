import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    login(email);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login('alex.rivera@example.edu');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to ScholarMatch AI
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to access your saved scholarships and application tracker.
        </p>
      </div>

      {/* Demo Account Instant Access Button */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center space-y-2">
        <span className="text-xs font-bold text-blue-900 block">
          🚀 Instant Demo Evaluation
        </span>
        <p className="text-[11px] text-blue-700 leading-snug">
          Explore the full experience with a pre-configured student profile and active tracker tasks.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
        >
          Sign In as Demo Scholar (1-Click)
        </button>
      </div>

      {/* Normal Form */}
      <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <a href="#" className="text-[11px] text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          Sign In
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
      </form>

    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'new.student@example.edu');
    navigate('/onboarding');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your Free Student Account
        </h1>
        <p className="text-xs text-slate-500">
          Unlock personalized scholarship recommendations and eligibility checks.
        </p>
      </div>

      <form onSubmit={handleRegister} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Elena Rostova"
            className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="elena@university.edu"
            className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="text-[11px] text-slate-500 space-y-1 pt-1">
          <div className="flex items-center gap-1 text-teal-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Third-Party Advertising Policy. Data never sold.</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          Create Account & Start Profile
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

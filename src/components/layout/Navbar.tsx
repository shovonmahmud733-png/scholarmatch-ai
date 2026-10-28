import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  Bookmark, 
  Layers, 
  BarChart3, 
  Search, 
  User as UserIcon, 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    profile, 
    savedScholarshipIds, 
    comparedScholarshipIds, 
    notifications, 
    markNotificationAsRead, 
    logout 
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { label: 'Discover', path: '/scholarships', icon: Search },
    { label: 'AI Matches', path: '/recommendations', icon: Sparkles, highlight: true },
    { label: 'Tracker', path: '/applications', icon: Layers },
    { label: 'Compare', path: '/compare', icon: BarChart3, badge: comparedScholarshipIds.length > 0 ? comparedScholarshipIds.length : null },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-800 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                ScholarMatch <span className="text-blue-600 font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">AI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Smart Global Funding</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active 
                      ? 'text-blue-700 bg-blue-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-600 text-white font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Saved items quick icon */}
            <Link 
              to="/saved" 
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hidden sm:flex items-center"
              title="Saved Scholarships"
            >
              <Bookmark className="w-5 h-5" />
              {savedScholarshipIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
              )}
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-sm">Notifications & Reminders</span>
                    <span className="text-xs text-slate-500">Live Demo</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-sm text-slate-500">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-sm hover:bg-slate-50 cursor-pointer transition ${!n.read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-800 text-xs">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                    <Link 
                      to="/settings" 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Notification Preferences
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Dashboard Menu */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full" 
                            style={{ width: `${profile?.profile_completion_percentage || 50}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {profile?.profile_completion_percentage || 50}%
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      Student Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                      Academic Profile & Preferences
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      Settings & Methodology
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/onboarding"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span>Saved Scholarships ({savedScholarshipIds.length})</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <UserIcon className="w-4 h-4 text-slate-500" />
            <span>Profile & Preferences</span>
          </Link>
        </div>
      )}
    </header>
  );
};

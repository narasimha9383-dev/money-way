// src/components/NotificationTray.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink, 
  MapPin, 
  Clock, 
  X, 
  Zap,
  Building
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function NotificationTray({ onSelectJob, onNavigateToTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const trayRef = useRef(null);

  const {
    notifications,
    unreadCount,
    isConnected,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    triggerTestNotification
  } = useNotifications();

  // Close tray when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (trayRef.current && !trayRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const displayedNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div className="relative" ref={trayRef}>
      {/* Bell Button with Live Badge */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-slate-800 text-emerald-400 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
            : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60'
        }`}
        title="Live Job Notifications & Alerts"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4" />
        
        {/* Pulsing indicator when connected and has unread */}
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : isConnected ? (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
        ) : null}
      </button>

      {/* Dropdown Tray */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Notifications</span>
                </h3>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-[10px] font-semibold text-emerald-300">
                    <Radio className="w-2.5 h-2.5 text-[#39E98A] animate-pulse" />
                    <span>Live</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                    Connecting...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Instant alerts for verified opportunities</p>
            </div>

            {/* Quick Controls: Sound toggle & close */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                    : 'text-slate-500 bg-slate-800/60 border-slate-700/60 hover:text-slate-300'
                }`}
                title={soundEnabled ? 'Mute alert sounds' : 'Enable alert chime'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Bar: Tabs & Mark All Read & Simulate Test Button */}
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTab === 'unread'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}

              {/* Simulate Live Notification Test Button */}
              <button
                onClick={() => triggerTestNotification()}
                className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[#39E98A] border border-emerald-500/30 font-semibold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Test real-time notification broadcast"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Test Live Alert</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-800/60">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">
                  {activeTab === 'unread' ? 'All caught up! No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Live real-time alerts will appear here when verified opportunities match your location.
                </p>
                <button
                  onClick={() => triggerTestNotification()}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  Simulate Live Alert
                </button>
              </div>
            ) : (
              displayedNotifications.map(item => {
                const isUnread = !item.read;
                const formattedTime = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      if (item.job && onSelectJob) {
                        onSelectJob(item.job);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer relative flex items-start gap-3 ${
                      isUnread ? 'bg-slate-850/70' : 'opacity-80'
                    }`}
                  >
                    {/* Unread dot */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {item.category || 'Opportunity Alert'}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formattedTime}</span>
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-tight ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {item.message}
                      </p>

                      {item.job?.salary && (
                        <div className="text-[11px] font-bold text-emerald-400">
                          {item.job.salary}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('alerts');
                setIsOpen(false);
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              Manage Alert Preferences &amp; Subscriptions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

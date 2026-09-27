// src/components/JobAlertsPage.jsx
// Cross-Device Job Alerts & Notification Center for Phone, Tablet, Laptop, and Desktop
// Powered by AI Query Understanding & Real-Time SSE Stream with zero hardcoded sectors

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Radio,
  Volume2,
  VolumeX,
  Zap,
  Smartphone,
  Laptop,
  Tablet,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { 
  fetchAlertsApi, 
  createAlertApi, 
  deleteAlertApi,
  reverseGeocodeApi
} from '../services/api.js';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function JobAlertsPage({
  userProfile = {},
  onSelectJob,
  onNavigateToTab
}) {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'notifications'
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testingAlert, setTestingAlert] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  // Global Realtime Notification System Context
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    soundEnabled, 
    deviceType,
    permissionStatus,
    requestDevicePermission,
    toggleSound, 
    markAsRead, 
    markAllAsRead, 
    triggerTestNotification 
  } = useNotifications();

  // Dynamic user location derived safely
  const defaultLocation = userProfile?.city || userProfile?.location || (() => {
    try {
      return localStorage.getItem('moneyway_chosen_location') || '';
    } catch {
      return '';
    }
  })();

  // Dynamic alert form state (zero hardcoded restrictions)
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    sector: '',
    location: defaultLocation,
    radiusKm: 25,
    employmentType: 'Any',
    experience: 'Any',
    remote: false
  });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Sync default location if user profile updates
  useEffect(() => {
    if (defaultLocation && !formData.location) {
      setFormData(prev => ({ ...prev, location: defaultLocation }));
    }
  }, [defaultLocation]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const alertsRes = await fetchAlertsApi();
      setAlerts(alertsRes?.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!formData.role.trim() && !formData.title.trim()) {
      alert('Please enter a role or job keyword to monitor.');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: formData.title || `${formData.role} in ${formData.location || 'Anywhere'}`,
        role: formData.role.trim(),
        sector: formData.sector.trim() || undefined,
        location: formData.location.trim() || undefined,
        radiusKm: Number(formData.radiusKm) || 25,
        employmentType: formData.employmentType !== 'Any' ? formData.employmentType : undefined,
        experience: formData.experience !== 'Any' ? formData.experience : undefined,
        remote: formData.remote
      };

      const res = await createAlertApi(payload);
      if (res?.alert) {
        setAlerts(prev => [res.alert, ...prev]);
        setCreateSuccess(true);
        setTimeout(() => {
          setCreateSuccess(false);
          setShowCreateModal(false);
          setFormData({
            title: '',
            role: '',
            sector: '',
            location: defaultLocation,
            radiusKm: 25,
            employmentType: 'Any',
            experience: 'Any',
            remote: false
          });
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to create alert:', err);
      alert('Failed to save alert. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await deleteAlertApi(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  // GPS detect for alert form
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await reverseGeocodeApi(latitude, longitude);
          if (res?.success && res.location?.city) {
            const locName = res.location.area 
              ? `${res.location.area}, ${res.location.city}`
              : res.location.city;
            setFormData(prev => ({ ...prev, location: locName }));
          } else if (res?.displayName) {
            setFormData(prev => ({ ...prev, location: res.displayName }));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setGeoLocating(false);
        }
      },
      () => setGeoLocating(false),
      { timeout: 7000 }
    );
  };

  // Broadcast test alert across all devices (Phone, Laptop, Tablet, Desktop)
  const handleTriggerTest = async () => {
    setTestingAlert(true);
    try {
      const activeLoc = defaultLocation || 'Your Area';
      await triggerTestNotification({
        title: `Verified Job Alert: New Vacancy in ${activeLoc}`,
        message: `AI Bridge detected an active verified opening matching your criteria in ${activeLoc}. Tap to view direct application link.`,
        company: 'Official Partner Network',
        location: activeLoc,
        salary: '₹20,000 - ₹35,000/month',
        type: 'nearby_job'
      });
    } catch (e) {
      console.error('Test trigger failed:', e);
    } finally {
      setTimeout(() => setTestingAlert(false), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-2 sm:px-0">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BANNER                                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Bell className="w-3.5 h-3.5" />
            <span>REAL-TIME JOB NOTIFICATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Alerts &amp; Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time verified job broadcasts across Phone, Tablet, Laptop, and Desktop. Never miss an opening near your home.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Alert</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. CROSS-DEVICE NOTIFICATION SETUP & DEVICE STATUS CARD      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700/60">
              {deviceType === 'phone' ? (
                <Smartphone className="w-5 h-5" />
              ) : deviceType === 'tablet' ? (
                <Tablet className="w-5 h-5" />
              ) : (
                <Laptop className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white capitalize">
                  Current Device: {deviceType === 'phone' ? 'Mobile Phone' : deviceType === 'tablet' ? 'Tablet' : 'Laptop / Desktop'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400'
                    : 'bg-amber-950/80 border-amber-800/60 text-amber-300'
                }`}>
                  {permissionStatus === 'granted' ? 'Native Notifications Active' : 'Setup Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {permissionStatus === 'granted'
                  ? 'This device will receive native push popups, audio chimes, and mobile vibration.'
                  : 'Enable native notifications so you receive job alerts even when browsing other tabs or apps.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {permissionStatus !== 'granted' && (
              <button
                type="button"
                onClick={requestDevicePermission}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Device Notifications</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTriggerTest}
              disabled={testingAlert}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Test chime, vibration, and notification"
            >
              <Zap className={`w-3.5 h-3.5 ${testingAlert ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span>{testingAlert ? 'Broadcasting…' : 'Test Multi-Device Alert'}</span>
            </button>
          </div>
        </div>

        {/* Feature indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>💻 Desktop &amp; Laptop OS</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>📱 Phone Push &amp; Vibrate</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>📟 Tablet Notifications</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔔 Sound Chime ({soundEnabled ? 'On' : 'Off'})</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. TAB SWITCHER (Active Alerts vs Notifications Stream)       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-2xl p-1.5 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Monitors ({alerts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Live Notifications Stream</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CONTENT AREA                                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Synchronizing alerts with real job feeds...</p>
        </div>
      ) : activeTab === 'alerts' ? (
        /* ALERTS TAB */
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 max-w-md mx-auto">
              <Bell className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active job monitors</h3>
              <p className="text-xs text-slate-400">
                Create an alert monitor to automatically get notified whenever new verified jobs matching your criteria arrive.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
              >
                Create First Alert
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {alerts.map(a => (
                <div 
                  key={a.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl relative group transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full uppercase">
                        {a.sector || a.role || 'Work Monitor'}
                      </span>
                      <h3 className="text-base font-bold text-white pt-1">{a.title || a.role}</h3>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(a.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{a.location || 'Anywhere'} (±{a.radiusKm || 25} km)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{a.employmentType || 'Any Schedule'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Check className="w-3 h-3" />
                      <span>Live AI Monitor Active</span>
                    </span>
                    <span>Created {new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* NOTIFICATIONS TAB (Realtime SSE) */
        <div className="space-y-4">
          {/* Stream Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                isConnected 
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' 
                  : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isConnected ? 'Real-Time SSE Stream Active' : 'Connecting to Stream...'}
              </span>
              <span className="text-xs text-slate-400">
                {notifications.length} updates ({unreadCount} unread)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-[11px]">{soundEnabled ? 'Chime On' : 'Chime Off'}</span>
              </button>

              <button
                onClick={handleTriggerTest}
                disabled={testingAlert}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${testingAlert ? 'animate-spin' : ''}`} />
                <span>{testingAlert ? 'Broadcasting...' : 'Broadcast Test Alert'}</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3 max-w-md mx-auto">
              <Bell className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No notifications yet</h3>
              <p className="text-xs text-slate-400">
                You will receive alerts here when real opportunities matching your saved monitors or local area appear.
              </p>
              <button
                onClick={handleTriggerTest}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate First Real-Time Notification</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    const targetJob = n.opportunity || n.job;
                    if (targetJob && onSelectJob) {
                      onSelectJob(targetJob);
                    } else if (onNavigateToTab) {
                      onNavigateToTab('search', null, n.title);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    n.read
                      ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                      : 'bg-slate-850 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    n.type === 'nearby_job' ? 'bg-teal-500/20 text-teal-300' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {n.type === 'nearby_job' ? <Navigation className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {n.category || 'Job Alert'}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      <span className="text-[11px] text-slate-500 ml-auto">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-300">{n.message}</p>

                    {(n.company || n.location || n.salary) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {n.company && (
                          <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                            {n.company}
                          </span>
                        )}
                        {n.location && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {n.location}
                          </span>
                        )}
                        {n.salary && (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                            {n.salary}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 mt-2 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. CREATE ALERT MODAL (Powered by AI Search Understanding)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Create Real-Time Job Alert</h3>
                <p className="text-xs text-slate-400">AI monitors verified feeds and notifies all your devices immediately</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              {/* Role / Search Query Input */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1">
                  <span>Job Role or Keywords to Monitor</span>
                  <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder='e.g. "Delivery Partner", "Electrician", "React Developer", "Accountant"...'
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Location & Radius */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">City or Town</label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={geoLocating}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{geoLocating ? 'Detecting…' : 'Near Me'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder='e.g. Vadlamudi, Tenali, or "Remote"'
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Search Radius</label>
                  <select
                    value={formData.radiusKm}
                    onChange={(e) => setFormData({ ...formData, radiusKm: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={15}>Within 15 km</option>
                    <option value={25}>Within 25 km</option>
                    <option value={50}>Within 50 km</option>
                    <option value={100}>Within 100 km</option>
                  </select>
                </div>
              </div>

              {/* Schedule Type & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Work Schedule</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Any">Any Schedule</option>
                    <option value="Part-time">Part-Time</option>
                    <option value="Full-time">Full-Time</option>
                    <option value="Gig">Gig / Delivery</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Experience Level</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Any">Any Experience</option>
                    <option value="Fresher">Fresher / Entry-Level</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>

              {/* Remote toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1 text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Include 100% Remote / Work from Home opportunities</span>
              </label>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {createSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Alert Created!</span>
                    </>
                  ) : creating ? (
                    <span>Saving Alert…</span>
                  ) : (
                    <span>Create Alert Monitor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

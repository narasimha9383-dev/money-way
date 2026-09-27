// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchNotificationsApi, 
  markNotificationReadApi, 
  markAllNotificationsReadApi,
  triggerTestNotificationApi,
  getNotificationStreamUrl 
} from '../services/api.js';

const NotificationContext = createContext(null);

/**
 * Detect current device type (phone, tablet, laptop/desktop)
 */
function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua) || window.innerWidth < 640) {
    return 'phone';
  }
  return 'desktop';
}

/**
 * Triggers hardware vibration on mobile phones and tablets
 */
function triggerDeviceVibration() {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch (err) {
    console.debug('Vibration not supported on this device:', err);
  }
}

/**
 * Triggers native OS / browser notification on Desktop, Laptop, Phone & Tablet
 */
function triggerNativeNotification(notif, onOpenJob) {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      const n = new Notification(notif.title || 'Money Way Job Alert', {
        body: notif.message || 'New verified opportunity matching your profile',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notif.id || 'job-alert',
        renotify: true
      });
      n.onclick = () => {
        window.focus();
        if (typeof onOpenJob === 'function') {
          onOpenJob(notif);
        } else {
          window.location.href = '/alerts';
        }
      };
    }
  } catch (err) {
    console.debug('Native notification display notice:', err);
  }
}

/**
 * Synthesizes a crisp modern chime using native Web Audio API
 * Works reliably on all modern browsers (phone, tablet, laptop, desktop)
 */
function playAudioChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Primary chime tone (High G5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(784, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15);

    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Harmonic overtone (E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.45);
  } catch {
    // Autoplay restrictions before user gesture
  }
}

export function NotificationProvider({ children, onSelectJob }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const [deviceType, setDeviceType] = useState('desktop');
  const [permissionStatus, setPermissionStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_notif_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toastTimerRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Detect device type on mount & resize
  useEffect(() => {
    setDeviceType(getDeviceType());
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Request browser permission for native notifications (Phone, Laptop, Tablet, Desktop)
  const requestDevicePermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Native notifications are not supported on this browser.');
      return 'unsupported';
    }
    try {
      const perm = await Notification.requestPermission();
      setPermissionStatus(perm);
      if (perm === 'granted') {
        // Send immediate confirmation notification
        triggerNativeNotification({
          title: 'Money Way Notifications Active',
          message: 'You will receive instant alerts for verified jobs on this device.'
        });
        triggerDeviceVibration();
        if (soundEnabled) playAudioChime();
      }
      return perm;
    } catch (err) {
      console.warn('Failed to request notification permission:', err);
      return 'denied';
    }
  };

  // Toggle sound preference
  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('moneyway_notif_sound', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Dispatch multi-device notification (native OS, sound, vibration, floating toast)
  const dispatchAlertToDevice = useCallback((notif) => {
    // 1. Native OS notification (Desktop, Laptop, Phone, Tablet)
    triggerNativeNotification(notif, () => {
      const targetJob = notif.opportunity || notif.job;
      if (targetJob && onSelectJob) {
        onSelectJob(targetJob);
      }
    });

    // 2. Hardware Vibration for phones & tablets
    triggerDeviceVibration();

    // 3. Audio Chime for all devices with sound enabled
    if (soundEnabled) {
      playAudioChime();
    }

    // 4. Responsive In-App floating Toast banner
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setActiveToast(notif);
    toastTimerRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 7000);
  }, [soundEnabled, onSelectJob]);

  // Load existing notifications on mount
  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetchNotificationsApi();
      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || res.notifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.warn('Failed to load initial notifications:', err);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Connect to Server-Sent Events (SSE) Stream
  useEffect(() => {
    const streamUrl = getNotificationStreamUrl();
    let es;

    try {
      es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
      };

      es.addEventListener('connected', () => {
        setIsConnected(true);
      });

      es.addEventListener('notification', (event) => {
        try {
          const newNotif = JSON.parse(event.data);
          if (!newNotif || !newNotif.id) return;

          // Add to notifications list
          setNotifications(prev => {
            const exists = prev.some(n => n.id === newNotif.id);
            if (exists) return prev;
            return [newNotif, ...prev];
          });
          setUnreadCount(prev => prev + 1);

          // Dispatch to phone, tablet, laptop, and desktop
          dispatchAlertToDevice(newNotif);
        } catch (parseErr) {
          console.error('Error parsing SSE notification payload:', parseErr);
        }
      });

      es.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.warn('EventSource initialization failed:', err);
      setIsConnected(false);
    }

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (es) {
        es.close();
      }
    };
  }, [dispatchAlertToDevice]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await markNotificationReadApi(id);
    } catch {}
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsReadApi();
    } catch {}
  };

  // Trigger test real-time notification across all devices
  const triggerTestNotification = async (customPayload = {}) => {
    try {
      const res = await triggerTestNotificationApi(customPayload);
      if (res?.notification) {
        setNotifications(prev => {
          if (prev.some(n => n.id === res.notification.id)) return prev;
          return [res.notification, ...prev];
        });
        setUnreadCount(prev => prev + 1);
        dispatchAlertToDevice(res.notification);
      }
      return res?.notification;
    } catch (err) {
      console.error('Error triggering test notification:', err);
    }
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setActiveToast(null);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isConnected,
      activeToast,
      soundEnabled,
      deviceType,
      permissionStatus,
      requestDevicePermission,
      toggleSound,
      markAsRead,
      markAllAsRead,
      triggerTestNotification,
      dismissToast,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}

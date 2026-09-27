// backend/services/alertNotificationService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateHaversineDistance, resolveCoordinates, getCoordinatesForLocation } from './locationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ALERTS_FILE = path.join(__dirname, '..', 'data', 'alertsStore.json');
const NOTIFICATIONS_FILE = path.join(__dirname, '..', 'data', 'notificationsStore.json');

let alertsCache = [];
let notificationsCache = [];
let isInitialized = false;

function loadStores() {
  try {
    if (fs.existsSync(ALERTS_FILE)) {
      const raw = fs.readFileSync(ALERTS_FILE, 'utf-8');
      alertsCache = JSON.parse(raw || '[]');
    } else {
      alertsCache = [];
      saveAlerts();
    }
  } catch (err) {
    alertsCache = [];
  }

  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      notificationsCache = JSON.parse(raw || '[]');
    } else {
      notificationsCache = [];
      saveNotifications();
    }
  } catch (err) {
    notificationsCache = [];
  }
}

function saveAlerts() {
  try {
    const dir = path.dirname(ALERTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(alertsCache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save alertsStore.json:', e.message);
  }
}

function saveNotifications() {
  try {
    const dir = path.dirname(NOTIFICATIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notificationsCache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save notificationsStore.json:', e.message);
  }
}

loadStores();

/**
 * Get all active alerts
 */
export function getAllAlerts(userId = null) {
  loadStores();
  if (userId) {
    return alertsCache.filter(a => !a.userId || a.userId === userId);
  }
  return alertsCache;
}

/**
 * Create a new job alert (Section 10)
 */
export function createAlert(alertData, userId = null) {
  loadStores();
  const id = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = alertData.title || `${alertData.role || alertData.sector || 'Job'} alert in ${alertData.location || 'All Locations'}`;

  const newAlert = {
    id,
    userId: userId || null,
    title,
    role: alertData.role || null,
    sector: alertData.sector || null,
    location: alertData.location || null,
    radiusKm: Number(alertData.radiusKm) || 15,
    employmentType: alertData.employmentType || null,
    experience: alertData.experience || null,
    remote: alertData.remote !== undefined ? Boolean(alertData.remote) : null,
    keywords: alertData.keywords || null,
    active: true,
    createdAt: new Date().toISOString(),
    matchCount: 0
  };

  alertsCache.unshift(newAlert);
  saveAlerts();
  return newAlert;
}

/**
 * Delete an alert
 */
export function deleteAlert(id, userId = null) {
  loadStores();
  const initialLen = alertsCache.length;
  alertsCache = alertsCache.filter(a => {
    if (a.id !== id) return true;
    if (userId && a.userId && a.userId !== userId) return true;
    return false;
  });
  saveAlerts();
  return alertsCache.length < initialLen;
}

/**
 * Retrieve notifications
 */
export function getNotifications(userId = null, { unreadOnly = false, limit = 50 } = {}) {
  loadStores();
  let list = [...notificationsCache];
  if (userId) {
    list = list.filter(n => !n.userId || n.userId === userId);
  }
  if (unreadOnly) {
    list = list.filter(n => !n.read);
  }
  return list.slice(0, limit);
}

/**
 * Mark notification as read
 */
export function markNotificationRead(id) {
  loadStores();
  const notif = notificationsCache.find(n => n.id === id);
  if (!notif) return null;
  notif.read = true;
  notif.readAt = new Date().toISOString();
  saveNotifications();
  return notif;
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsRead(userId = null) {
  loadStores();
  notificationsCache.forEach(n => {
    if (!userId || !n.userId || n.userId === userId) {
      n.read = true;
      n.readAt = new Date().toISOString();
    }
  });
  saveNotifications();
  return true;
}

/**
 * Trigger notification when a matching real job arrives (Section 10)
 */
export function createNotificationForJob(job, alert = null, type = 'job_alert') {
  loadStores();
  if (!job || !job.id) return null;

  // Prevent duplicate notification for same job & alert within 24h
  const existing = notificationsCache.find(n => n.jobId === job.id && n.type === type && (Date.now() - new Date(n.createdAt).getTime() < 86400000));
  if (existing) return existing;

  let category = 'Job Alert';
  let title = `Matching Job: ${job.title}`;
  if (type === 'nearby_job') {
    category = 'Nearby Job';
    title = `Nearby opportunity: ${job.title}`;
  } else if (type === 'saved_job_update') {
    category = 'Saved Job Update';
    title = `Update on saved job: ${job.title}`;
  }

  const notif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    alertId: alert?.id || null,
    userId: alert?.userId || null,
    type,
    category,
    title,
    message: `${job.company || 'Verified Employer'} • ${job.location || 'Local'}${job.salary ? ` • ${job.salary}` : ''}`,
    jobId: job.id,
    targetUrl: `/jobs/${job.id}`,
    job: {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      postedAt: job.postedAt,
      applicationUrl: job.applicationUrl || job.applyUrl,
      verified: job.verified
    },
    read: false,
    createdAt: new Date().toISOString()
  };

  notificationsCache.unshift(notif);
  if (notificationsCache.length > 200) {
    notificationsCache = notificationsCache.slice(0, 200);
  }
  saveNotifications();

  // Broadcast to all active real-time SSE clients
  broadcastNotification(notif);

  return notif;
}

// Active Server-Sent Events client connections
const sseClients = new Set();

/**
 * Register a client connection for real-time SSE notification stream
 */
export function registerSseClient(res) {
  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });
}

/**
 * Broadcast an event payload to all currently connected browsers
 */
export function broadcastNotification(notification) {
  if (!notification || sseClients.size === 0) return;
  const payload = `event: notification\ndata: ${JSON.stringify(notification)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Send periodic heartbeat to keep SSE sockets open
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': ping\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 25000);

/**
 * Trigger an instant verified real-time notification for test or live opportunity detection
 */
export function triggerRealtimeNotification({
  title = 'Local Delivery Partner',
  company = 'Verified Partner Network',
  location = 'Your Locality',
  salary = '₹18,000–₹28,000/month',
  jobId = 'partner-local-delivery',
  category = 'Nearby Job',
  type = 'nearby_job'
} = {}) {
  const notif = {
    id: `notif_rt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    category,
    title: `New Real-Time Opportunity in ${location.split(',')[0]}!`,
    message: `${title} at ${company} (${salary})`,
    jobId,
    targetUrl: `/jobs/${jobId}`,
    job: {
      id: jobId,
      title,
      company,
      location,
      salary,
      postedAt: new Date().toISOString(),
      exactApplicationLinkAvailable: true,
      linkActionLabel: 'Apply on Partner Portal',
      applicationUrl: 'https://ride.swiggy.com/',
      verified: true
    },
    read: false,
    createdAt: new Date().toISOString()
  };

  notificationsCache.unshift(notif);
  if (notificationsCache.length > 200) notificationsCache = notificationsCache.slice(0, 200);
  saveNotifications();

  // Push directly to connected SSE sockets
  broadcastNotification(notif);
  return notif;
}

/**
 * Check incoming batch of real jobs against all active alerts
 */
export function evaluateAlertsAgainstJobs(jobs = []) {
  loadStores();
  if (!Array.isArray(jobs) || jobs.length === 0 || alertsCache.length === 0) return [];

  const createdNotifications = [];

  for (const alert of alertsCache) {
    if (!alert.active) continue;

    for (const job of jobs) {
      if (!job || !job.id) continue;

      let match = true;

      // Sector check
      if (alert.sector && job.sector) {
        if (!job.sector.toLowerCase().includes(alert.sector.toLowerCase()) &&
            !alert.sector.toLowerCase().includes(job.sector.toLowerCase())) {
          match = false;
        }
      }

      // Role / Title check
      if (match && alert.role) {
        const rLower = alert.role.toLowerCase();
        const tLower = (job.title || '').toLowerCase();
        const dLower = (job.description || '').toLowerCase();
        if (!tLower.includes(rLower) && !dLower.includes(rLower)) {
          match = false;
        }
      }

      // Location check
      if (match && alert.location && job.location) {
        const aLoc = alert.location.toLowerCase();
        const jLoc = job.location.toLowerCase();
        if (!jLoc.includes(aLoc) && !job.isRemote && !job.remote) {
          match = false;
        }
      }

      // Employment type check
      if (match && alert.employmentType && job.employmentType) {
        if (!job.employmentType.toLowerCase().includes(alert.employmentType.toLowerCase())) {
          match = false;
        }
      }

      // Remote check
      if (match && alert.remote === true && !job.isRemote && !job.remote) {
        match = false;
      }

      if (match) {
        alert.matchCount = (alert.matchCount || 0) + 1;
        const notif = createNotificationForJob(job, alert, 'job_alert');
        if (notif) createdNotifications.push(notif);
        break; // Max 1 notification per alert per evaluation run
      }
    }
  }

  saveAlerts();
  return createdNotifications;
}

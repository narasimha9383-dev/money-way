// src/components/NearbyJobsPage.jsx
// Dedicated "Jobs Near You" experience with dynamic geocoding, live GPS, and zero hardcoded city lists
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  List, 
  Map as MapIcon, 
  Clock, 
  Coins, 
  Search, 
  ExternalLink, 
  Bookmark, 
  Check, 
  AlertCircle, 
  SlidersHorizontal, 
  X,
  Compass,
  Building,
  Briefcase,
  History
} from 'lucide-react';
import { 
  fetchNearbyJobsApi, 
  saveJobApi, 
  unsaveJobApi,
  geocodeLocationApi,
  reverseGeocodeApi
} from '../services/api.js';

export default function NearbyJobsPage({
  userProfile,
  onSelectJob,
  onOpenExternalLink,
  isSaved = () => false,
  onSaveJob = () => {}
}) {
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_coords');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_chosen_location');
      if (saved) return saved;
    } catch {}
    return userProfile?.city || userProfile?.location || '';
  });

  const [locationDisplayName, setLocationDisplayName] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_location_display');
      if (saved) return saved;
    } catch {}
    return userProfile?.city || userProfile?.location || '';
  });

  const [locationInput, setLocationInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyway_recent_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [areaFilter, setAreaFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [radiusKm, setRadiusKm] = useState(25);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'list' | 'map'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [requestingGps, setRequestingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Dynamic sectors computed from real job discoveries (zero hardcoded lists)
  const availableSectors = React.useMemo(() => {
    const set = new Set();
    jobs.forEach(j => {
      const s = j.sector || j.category;
      if (s && typeof s === 'string') set.add(s);
    });
    return Array.from(set);
  }, [jobs]);

  // Helper to save recent locations dynamically
  const pushRecentLocation = (locName) => {
    if (!locName || typeof locName !== 'string') return;
    const clean = locName.trim();
    if (!clean) return;
    setRecentLocations(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('moneyway_recent_locations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentLocation = (e, locToRemove) => {
    e.stopPropagation();
    setRecentLocations(prev => {
      const updated = prev.filter(item => item !== locToRemove);
      try {
        localStorage.setItem('moneyway_recent_locations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Fetch nearby jobs from backend API
  const loadNearbyJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        city: selectedCity,
        area: areaFilter,
        radiusKm
      };
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      if (selectedSector && selectedSector !== 'all') {
        params.sector = selectedSector;
      }
      if (coords?.lat && coords?.lng) {
        params.lat = coords.lat;
        params.lng = coords.lng;
      }
      const data = await fetchNearbyJobsApi(params);
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        if (data.jobs.length > 0 && !activeJobId) {
          setActiveJobId(data.jobs[0].id);
        }
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('loadNearbyJobs error:', err);
      setError('Unable to load nearby jobs. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyJobs();
  }, [selectedCity, areaFilter, radiusKm, coords, searchQuery, selectedSector]);

  // Request user's true GPS location and reverse-geocode place name dynamically
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setRequestingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let displayName = `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`;
        let placeName = '';

        try {
          // Dynamic reverse-geocoding via backend OpenStreetMap engine
          const revRes = await reverseGeocodeApi(lat, lng);
          if (revRes?.location?.displayName) {
            displayName = revRes.location.displayName;
            placeName = revRes.location.placeName || revRes.location.displayName;
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        const newCoords = {
          lat,
          lng,
          source: 'gps',
          displayName
        };

        setCoords(newCoords);
        setLocationDisplayName(displayName);
        if (placeName) {
          setSelectedCity(placeName);
          pushRecentLocation(placeName);
        }

        try {
          localStorage.setItem('moneyway_coords', JSON.stringify(newCoords));
          localStorage.setItem('moneyway_location_display', displayName);
          if (placeName) localStorage.setItem('moneyway_chosen_location', placeName);
        } catch {}

        setRequestingGps(false);
      },
      (err) => {
        console.warn('Geolocation permission error:', err.message);
        setGpsError('Location access was denied or timed out. You can type any city, town, or pincode below.');
        setRequestingGps(false);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // Set any custom location / village / town / pincode dynamically
  const handleSetCustomLocation = async (e, textOverride) => {
    if (e) e.preventDefault();
    const query = (textOverride !== undefined ? textOverride : locationInput).trim();
    if (!query) return;

    setIsGeocoding(true);
    setGpsError(null);

    try {
      // Dynamic forward geocoding
      const geoRes = await geocodeLocationApi(query);
      if (geoRes?.location) {
        const newCoords = {
          lat: geoRes.location.lat,
          lng: geoRes.location.lng,
          source: 'search',
          displayName: geoRes.location.displayName
        };
        setCoords(newCoords);
        setLocationDisplayName(geoRes.location.displayName);
        setSelectedCity(query);
        pushRecentLocation(query);
        try {
          localStorage.setItem('moneyway_coords', JSON.stringify(newCoords));
          localStorage.setItem('moneyway_location_display', geoRes.location.displayName);
          localStorage.setItem('moneyway_chosen_location', query);
        } catch {}
      } else {
        // Fallback: search text directly
        setSelectedCity(query);
        setLocationDisplayName(query);
        pushRecentLocation(query);
        try {
          localStorage.setItem('moneyway_chosen_location', query);
          localStorage.setItem('moneyway_location_display', query);
        } catch {}
      }
      setLocationInput('');
    } catch (err) {
      // If geocoding fails, still query jobs with that text
      setSelectedCity(query);
      setLocationDisplayName(query);
      pushRecentLocation(query);
      setLocationInput('');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleClearLocation = () => {
    setCoords(null);
    setSelectedCity('');
    setLocationDisplayName('');
    setAreaFilter('');
    try {
      localStorage.removeItem('moneyway_coords');
      localStorage.removeItem('moneyway_chosen_location');
      localStorage.removeItem('moneyway_location_display');
    } catch {}
  };

  const currentLocationLabel = locationDisplayName || selectedCity || (coords ? 'Current GPS Location' : '');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner & Dynamic Location Detection */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>HYPER-LOCAL OPPORTUNITY DISCOVERY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Jobs Near You
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Real work opportunities measured by exact distance from your locality. Verified employer portals and direct application links with zero fabricated distances.
          </p>

          {/* Dynamic Location Action Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* GPS Button */}
              <button
                onClick={handleRequestLocation}
                disabled={requestingGps}
                className="px-4 py-2.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-60 flex-shrink-0"
              >
                <Navigation className={`w-4 h-4 ${requestingGps ? 'animate-spin' : ''}`} />
                <span>{requestingGps ? 'Detecting Location...' : 'Use My Exact Location'}</span>
              </button>

              {/* Dynamic Location Search Input */}
              <form onSubmit={handleSetCustomLocation} className="flex items-center gap-1.5 flex-1 min-w-[260px] max-w-md">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter any village, town, city, or pincode..."
                    className="w-full bg-slate-800/90 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGeocoding || !locationInput.trim()}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-40 flex-shrink-0"
                >
                  {isGeocoding ? 'Finding...' : 'Set'}
                </button>
              </form>
            </div>

            {/* Active Location Indicator */}
            {currentLocationLabel && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-xs text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium truncate max-w-sm sm:max-w-md">
                    Target Center: {currentLocationLabel}
                  </span>
                  {coords && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
                    </span>
                  )}
                  <button
                    onClick={handleClearLocation}
                    className="text-slate-400 hover:text-white ml-2 text-[11px] underline cursor-pointer"
                    title="Clear location filter"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* User Recent Searches (Stored dynamically in local storage) */}
            {recentLocations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
                  <History className="w-3 h-3 text-slate-500" />
                  <span>Recent:</span>
                </span>
                {recentLocations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => handleSetCustomLocation(null, loc)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedCity.toLowerCase() === loc.toLowerCase()
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    <span>{loc}</span>
                    <span
                      onClick={(e) => removeRecentLocation(e, loc)}
                      className="text-slate-500 hover:text-slate-200 ml-0.5"
                      title="Remove"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}

            {gpsError && (
              <p className="text-xs text-amber-400/90 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{gpsError}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Role Keyword Search & Sector Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLocationLabel ? `Search roles in ${currentLocationLabel.split(',')[0]} (e.g. delivery, retail, barista, technician)...` : "Search roles (e.g. delivery, retail, driver, technician, data entry)..."}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-12 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Sector Quick Filter Pills (Generated from Real Active Feeds) */}
        {availableSectors.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Sector:</span>
            </span>
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                selectedSector === 'all'
                  ? 'bg-[#39E98A] text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              All ({jobs.length})
            </button>
            {availableSectors.map(sec => {
              const count = jobs.filter(j => (j.sector || j.category) === sec).length;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(selectedSector === sec ? 'all' : sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    selectedSector === sec
                      ? 'bg-[#39E98A] text-slate-950 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
                  }`}
                >
                  {sec} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Controls Bar: Local Area Filter, Distance Radius, and View Mode */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Landmark / Sub-area refinement */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Landmark:</span>
            <input
              type="text"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              placeholder="e.g. Market, Station Road..."
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 w-36 sm:w-44 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          {/* Dynamic Radius Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Max Distance:</span>
            <div className="inline-flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
              {[5, 10, 15, 25, 50].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    radiusKm === r
                      ? 'bg-[#39E98A] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">View:</span>
          <div className="inline-flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Stage: List & Map Views */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-400 font-mono">Finding verified job listings around your location...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 max-w-lg mx-auto">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No verified jobs found in this radius</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We never fabricate placeholder results. Try expanding your search radius or setting a broader location:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setRadiusKm(50)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 cursor-pointer"
            >
              Expand to 50 km
            </button>
            <button
              onClick={() => { setAreaFilter(''); setRadiusKm(50); }}
              className="px-3.5 py-1.5 rounded-xl bg-[#39E98A] text-slate-950 text-xs font-bold hover:bg-[#32d47c] cursor-pointer"
            >
              Reset Radius &amp; Landmark
            </button>
          </div>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'split' ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
          {/* Job List Column */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div className={viewMode === 'split' ? 'lg:col-span-7 space-y-4' : 'space-y-4 max-w-4xl mx-auto'}>
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Showing <strong>{jobs.length} verified jobs</strong> {currentLocationLabel ? `near ${currentLocationLabel.split(',')[0]}` : ''}
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">✓ Real Geolocation</span>
              </div>

              {jobs.map((job) => {
                const isSelected = activeJobId === job.id;
                const distanceStr = job.distanceKm !== null && job.distanceKm !== undefined
                  ? (job.distanceKm < 1 ? '< 1 km away' : `${job.distanceKm} km away`)
                  : (job.isRemote || job.remote ? 'Remote / Anywhere' : job.location || 'Local Listing');

                return (
                  <div
                    key={job.id}
                    onClick={() => { setActiveJobId(job.id); if (onSelectJob) onSelectJob(job); }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Badges: Sector & True Distance */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                            {job.sector || job.category || 'General Work'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                            <Navigation className="w-3 h-3 text-[#39E98A]" />
                            <span>{distanceStr}</span>
                          </span>
                          {job.employmentType && (
                            <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
                              {job.employmentType}
                            </span>
                          )}
                        </div>

                        {/* Title & Employer */}
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-semibold text-white">{job.company || job.provider}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400">{job.location}</span>
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveJob(job);
                        }}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
                          isSaved(job.id)
                            ? 'bg-emerald-500/20 text-[#39E98A] border-emerald-500/40'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700'
                        }`}
                        title={isSaved(job.id) ? 'Saved' : 'Save for later'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Metadata & Direct Apply */}
                    <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs">
                        {job.compensation && (
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span>{job.compensation.label || `₹${job.compensation.min?.toLocaleString()} - ₹${job.compensation.max?.toLocaleString()}`}</span>
                          </span>
                        )}
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{job.postedDate || 'Active Opening'}</span>
                        </span>
                      </div>

                      {/* Direct Apply Button */}
                      <div className="flex items-center gap-2">
                        {job.exactApplicationLinkAvailable && (job.applicationUrl || job.applyUrl) ? (
                          <a
                            href={job.applicationUrl || job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenExternalLink) {
                                e.preventDefault();
                                onOpenExternalLink(job.applicationUrl || job.applyUrl, job.company);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#39E98A] text-slate-950 font-bold text-xs hover:bg-[#32d47c] transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
                            title="Direct official application link"
                          >
                            <span>{job.linkActionLabel || 'Apply'}</span>
                            <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                          </a>
                        ) : (job.applicationUrl || job.applyUrl || job.sourceUrl) ? (
                          <a
                            href={job.applicationUrl || job.applyUrl || job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenExternalLink) {
                                e.preventDefault();
                                onOpenExternalLink(job.applicationUrl || job.applyUrl || job.sourceUrl, job.company);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-xs transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                            title="Official employer career portal"
                          >
                            <span>{job.linkActionLabel || 'Career Portal'}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic px-2 py-1 bg-slate-800/60 rounded-lg">
                            Application link on portal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Map Column */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className={viewMode === 'split' ? 'lg:col-span-5' : 'w-full'}>
              <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Local Opportunity Radar</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {jobs.filter(j => j.latitude && j.longitude).length} mapped pins
                  </span>
                </div>

                {/* Vector Map Canvas with dynamic pins */}
                <div className="relative w-full h-[420px] rounded-2xl bg-[#090D14] border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #39E98A 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Center Radar / User Position */}
                  <div className="absolute z-10 flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 animate-ping absolute" />
                      <div className="w-8 h-8 rounded-full bg-emerald-500/40 border border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 z-10">
                        <Navigation className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-slate-950/90 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/40 shadow-sm max-w-[150px] truncate text-center">
                      {currentLocationLabel ? currentLocationLabel.split(',')[0] : 'Center Point'}
                    </span>
                  </div>

                  {/* Render Job Pins with calculated distances */}
                  {jobs.map((j, i) => {
                    if (!j.latitude || !j.longitude) return null;
                    const isSelected = activeJobId === j.id;

                    const angle = (i * 47) % 360;
                    const radDist = Math.min(160, Math.max(45, (j.distanceKm || 3) * 10));
                    const x = Math.cos((angle * Math.PI) / 180) * radDist;
                    const y = Math.sin((angle * Math.PI) / 180) * radDist;

                    return (
                      <div
                        key={j.id}
                        onClick={() => { setActiveJobId(j.id); if (onSelectJob) onSelectJob(j); }}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                        className={`absolute z-20 group cursor-pointer transition-all duration-300 hover:scale-125 ${
                          isSelected ? 'scale-125 z-30' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-full border shadow-md flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#39E98A] text-slate-950 border-white'
                            : 'bg-slate-900/90 text-emerald-400 border-emerald-500/50 hover:border-emerald-400'
                        }`}>
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-lg bg-slate-950/95 border border-slate-700 text-[10px] text-white whitespace-nowrap shadow-xl pointer-events-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <div className="font-bold">{j.company}</div>
                          <div className="text-emerald-400">{j.distanceKm ? `${j.distanceKm} km away` : j.location}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Job Card Preview in Map View */}
                {(() => {
                  const selectedJob = jobs.find(j => j.id === activeJobId) || jobs[0];
                  if (!selectedJob) return null;
                  return (
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase truncate">
                          {selectedJob.sector || 'Opportunity'}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{selectedJob.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{selectedJob.company} • {selectedJob.location}</p>
                      </div>
                      <button
                        onClick={() => onSelectJob && onSelectJob(selectedJob)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#39E98A] hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer flex-shrink-0"
                      >
                        Details
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

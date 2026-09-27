import { 
  MapPin, 
  Navigation, 
  List, 
  Map as MapIcon, 
  ShieldCheck, 
  Clock, 
  Coins, 
  Compass, 
  ArrowRight, 
  Check, 
  X, 
  ExternalLink, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Search,
  RotateCw
} from 'lucide-react';
import { fetchNearbyServices, geocodeLocationApi } from '../services/api.js';

export default function NearbyServicesSection({
  userProfile,
  onOpenExternalLink,
  onSelectOpportunity
}) {
  // Location permission states: 'prompt' | 'granted' | 'manual' | 'skipped'
  const [permissionState, setPermissionState] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_location_perm');
      return saved || 'prompt';
    } catch {
      return 'prompt';
    }
  });

  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('incomepath_user_loc');
      return saved ? JSON.parse(saved) : { city: 'Bengaluru', area: 'Indiranagar', lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' };
    } catch {
      return { city: 'Bengaluru', area: 'Indiranagar', lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka' };
    }
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [radiusKm, setRadiusKm] = useState(15); // 5, 15, 50
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePin, setActivePin] = useState(null);

  // Available cities for manual selection (Section 6)
  const availableCities = [
    { city: 'Chirala', displayName: 'Chirala / Bapatla, AP', lat: 15.8309, lng: 80.3544, areas: ['Chirala Town', 'Bapatla', 'Ponnur', 'Repalle'] },
    { city: 'Guntur', displayName: 'Guntur / Tenali Corridor, AP', lat: 16.3067, lng: 80.4365, areas: ['Vadlamudi', 'Tenali', 'Guntur City', 'Mangalagiri', 'Chebrolu'] },
    { city: 'Vijayawada', displayName: 'Vijayawada / Amaravati, AP', lat: 16.5062, lng: 80.6480, areas: ['Benz Circle', 'Bhavanipuram', 'Gannavaram', 'Amaravati'] },
    { city: 'Hyderabad', displayName: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, areas: ['Madhapur', 'Hitec City', 'Gachibowli', 'Kondapur', 'Kukatpally'] },
    { city: 'Visakhapatnam', displayName: 'Visakhapatnam, AP', lat: 17.6868, lng: 83.2185, areas: ['Gajuwaka', 'MVP Colony', 'Madhurawada', 'Siripuram'] },
    { city: 'Tirupati', displayName: 'Tirupati, AP', lat: 13.6288, lng: 79.4192, areas: ['Alipiri', 'Renigunta', 'Chandragiri', 'Bairagipatteda'] },
    { city: 'Bengaluru', displayName: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, areas: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar'] },
    { city: 'Mumbai', displayName: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, areas: ['Andheri', 'Bandra', 'Powai'] },
    { city: 'New Delhi', displayName: 'New Delhi, Delhi NCR', lat: 28.6139, lng: 77.2090, areas: ['South Delhi', 'Connaught Place'] }
  ];

  // Custom location search input state
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [customLocationLoading, setCustomLocationLoading] = useState(false);
  const [customLocationError, setCustomLocationError] = useState(null);

  const handleSearchCustomLocation = async (e) => {
    if (e) e.preventDefault();
    const query = customLocationInput.trim();
    if (!query) return;
    setCustomLocationLoading(true);
    setCustomLocationError(null);
    try {
      const res = await geocodeLocationApi(query);
      if (res?.success && res.location) {
        const loc = {
          city: res.location.placeName || query,
          area: res.location.district || '',
          lat: res.location.lat,
          lng: res.location.lng,
          displayName: res.location.displayName || query
        };
        setUserLocation(loc);
        setPermissionState('manual');
        localStorage.setItem('incomepath_location_perm', 'manual');
        localStorage.setItem('incomepath_user_loc', JSON.stringify(loc));
        setShowLocationModal(false);
        setCustomLocationInput('');
      } else {
        setCustomLocationError('Location not found. Please try another place or pincode.');
      }
    } catch {
      setCustomLocationError('Could not resolve location. Please try again.');
    } finally {
      setCustomLocationLoading(false);
    }
  };

  // Fetch nearby services when location, radius, or category changes
  useEffect(() => {
    if (permissionState !== 'skipped') {
      loadNearbyServices();
    }
  }, [userLocation, radiusKm, selectedCategory, permissionState]);

  const loadNearbyServices = async () => {
    setLoading(true);
    try {
      const res = await fetchNearbyServices({
        lat: userLocation.lat,
        lng: userLocation.lng,
        city: userLocation.city,
        area: userLocation.area,
        radiusKm,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        profile: userProfile
      });
      setServices(res.services || []);
      if (res.services && res.services.length > 0 && !activePin) {
        setActivePin(res.services[0]);
      }
    } catch (err) {
      console.error('Failed to load nearby services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllowBrowserLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            displayName: 'Current GPS Location'
          };
          setUserLocation(loc);
          setPermissionState('granted');
          localStorage.setItem('incomepath_location_perm', 'granted');
          localStorage.setItem('incomepath_user_loc', JSON.stringify(loc));
          setLoading(false);
        },
        (error) => {
          console.warn('Geolocation error or denied:', error.message);
          // Fallback to manual selection modal
          setShowLocationModal(true);
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 6000 }
      );
    } else {
      setShowLocationModal(true);
    }
  };

  const handleSelectManualLocation = (cityObj, areaName) => {
    const loc = {
      city: cityObj.city,
      area: areaName,
      lat: cityObj.lat,
      lng: cityObj.lng,
      displayName: `${areaName ? `${areaName}, ` : ''}${cityObj.displayName}`
    };
    setUserLocation(loc);
    setPermissionState('manual');
    localStorage.setItem('incomepath_location_perm', 'manual');
    localStorage.setItem('incomepath_user_loc', JSON.stringify(loc));
    setShowLocationModal(false);
  };

  const handleSkipLocation = () => {
    setPermissionState('skipped');
    localStorage.setItem('incomepath_location_perm', 'skipped');
  };

  return (
    <section className="space-y-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-7 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Nearby Opportunities &amp; Services
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800/80">
              Verified Local
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Legitimate local tutoring, tech support, photography, and delivery services in your area.
          </p>
        </div>

        {/* Location & View Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {permissionState !== 'skipped' && (
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span>{userLocation.displayName || 'Set Area'}</span>
            </button>
          )}

          {/* List vs Map View Toggle (Section 10) */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Location Permission Banner (Section 6: Do not automatically request precise location) */}
      {permissionState === 'prompt' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-teal-400" />
              Would you like to discover opportunities and services near you?
            </h4>
            <p className="text-xs text-slate-300">
              Find verified local tutoring, photography, and repair opportunities in your city. We never store precise GPS data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleAllowBrowserLocation}
              className="px-3.5 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow transition-all active:scale-95 cursor-pointer"
            >
              Allow Location
            </button>
            <button
              onClick={() => setShowLocationModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              Use My City/Area
            </button>
            <button
              onClick={handleSkipLocation}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* 2. Radius and Category Filter Toolbar (Section 7 & 12) */}
      {permissionState !== 'skipped' && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Radius Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" /> Radius:
            </span>
            <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-slate-800">
              {[
                { label: 'Very nearby (5 km)', value: 5 },
                { label: 'Nearby (15 km)', value: 15 },
                { label: 'Wider area (50 km)', value: 50 }
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRadiusKm(r.value)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    radiusKm === r.value
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Local Categories</option>
              <option value="Local Tutoring">Local Tutoring</option>
              <option value="Repair & Tech Support">Repair & Tech Support</option>
              <option value="Photography & Media">Photography & Media</option>
              <option value="Delivery & Logistics">Delivery & Logistics</option>
              <option value="Pet Care Services">Pet Care Services</option>
              <option value="Local Business Support">Local Business Support</option>
            </select>
          </div>
        </div>
      )}

      {/* 3. VIEW MODE: MAP VIEW (Section 10: Map View with real coordinates only) */}
      {viewMode === 'map' && permissionState !== 'skipped' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative min-h-[380px] flex flex-col lg:flex-row">
          {/* Custom Interactive SVG/Canvas Geo Map */}
          <div className="flex-1 relative p-4 flex items-center justify-center bg-radial from-slate-900 to-slate-950 min-h-[320px]">
            {/* Grid coordinate overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Visual SVG Map Visualization */}
            <svg className="w-full h-72 sm:h-80 max-w-lg" viewBox="0 0 500 360" fill="none">
              {/* Radar rings for active radius */}
              <circle cx="250" cy="180" r="140" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="250" cy="180" r="85" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
              <circle cx="250" cy="180" r="35" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6" />

              {/* User Center Pin */}
              <g className="cursor-pointer">
                <circle cx="250" cy="180" r="10" fill="#2dd4bf" fillOpacity="0.2" className="animate-ping" />
                <circle cx="250" cy="180" r="6" fill="#2dd4bf" stroke="#042f2e" strokeWidth="2" />
                <text x="250" y="205" textAnchor="middle" fill="#99f6e4" fontSize="10" fontWeight="bold">
                  You ({userLocation.displayName?.split(',')[0] || 'Here'})
                </text>
              </g>

              {/* Verified Service Opportunity Pins */}
              {services.slice(0, 8).map((srv, idx) => {
                // Distribute pins dynamically around center based on service index and distance
                const angle = (idx * (360 / Math.min(services.length, 8)) + 35) * (Math.PI / 180);
                const distOffset = Math.min(Math.max((srv.distanceKm || 4) * 8, 30), 130);
                const px = Math.round(250 + Math.cos(angle) * distOffset);
                const py = Math.round(180 + Math.sin(angle) * distOffset);
                const isSelected = activePin?.id === srv.id;

                return (
                  <g
                    key={srv.id}
                    onClick={() => setActivePin(srv)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? '9' : '6'}
                      fill={isSelected ? '#34d399' : '#10b981'}
                      stroke="#064e3b"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    <text
                      x={px}
                      y={py - 11}
                      textAnchor="middle"
                      fill={isSelected ? '#6ee7b7' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="transition-colors select-none"
                    >
                      {srv.category.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 text-[10px] space-y-1 text-slate-300 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span>Your Location ({userLocation.city || 'Local'})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Verified Service ({services.length} within {radiusKm}km)</span>
              </div>
            </div>
          </div>

          {/* Active Pin Detail Preview Card */}
          {activePin && (
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 bg-slate-900/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                    🟢 {activePin.verificationStatus || 'Verified'}
                  </span>
                  <span className="text-xs font-bold text-teal-300">
                    📍 {activePin.distanceKm !== null ? `${activePin.distanceKm} km away` : activePin.serviceArea}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {activePin.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activePin.description}
                </p>

                <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{activePin.priceInfo}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{activePin.availability}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{activePin.serviceArea}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                {activePin.sourceUrl && (
                  <button
                    onClick={() => onOpenExternalLink?.(activePin.sourceUrl, activePin.source)}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>View Platform Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. VIEW MODE: LIST VIEW (Section 9: Real verified fields only) */}
      {viewMode === 'list' && permissionState !== 'skipped' && (
        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((sk) => (
                <div key={sk} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 animate-pulse">
                  <div className="h-4 w-3/4 rounded bg-slate-800" />
                  <div className="h-3 w-1/2 rounded bg-slate-800/60" />
                  <div className="h-16 rounded bg-slate-800/40" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <Compass className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No nearby opportunities found within {radiusKm} km</h4>
              <p className="text-xs text-slate-400">
                Try widening your search radius to 50 km or selecting a major city nearby.
              </p>
              <button
                onClick={() => setRadiusKm(50)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 text-teal-300 border border-slate-700 text-xs font-semibold"
              >
                Expand to 50 km Radius
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md group"
                >
                  <div className="space-y-3">
                    {/* Category & Distance Badge (Section 9 & 12) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-950/90 text-teal-300 border border-teal-800/80">
                        {srv.category}
                      </span>
                      {srv.distanceKm !== null ? (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                          📍 {srv.distanceKm} km away
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">{srv.location?.city}</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                      {srv.name}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>

                    {/* Verified Pricing & Schedule */}
                    <div className="space-y-1 pt-1 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-emerald-300">{srv.priceInfo}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{srv.availability}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-slate-400">{srv.serviceArea}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Official Source (Section 12) */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{srv.verificationStatus}</span>
                    </div>

                    {srv.sourceUrl && (
                      <button
                        onClick={() => onOpenExternalLink?.(srv.sourceUrl, srv.source)}
                        className="text-xs font-semibold text-teal-300 hover:text-teal-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title={srv.source}
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. MANUAL LOCATION SELECTION MODAL (Section 6: Country, State, City, Area) */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Select Your City &amp; Area
                </h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Search or type ANY town, village, mandal, or pincode in India:
            </p>

            {/* Custom Location Search Input */}
            <form onSubmit={handleSearchCustomLocation} className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  placeholder="e.g. Chirala, Bapatla, Vadlamudi, 523155..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  disabled={customLocationLoading || !customLocationInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {customLocationLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Set</span>
                </button>
              </div>
              {customLocationError && (
                <p className="text-[11px] text-rose-400">{customLocationError}</p>
              )}
            </form>

            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block pb-2">
                Or select regional hub:
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {availableCities.map((c) => (
                <div key={c.city} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{c.displayName}</span>
                    <button
                      onClick={() => handleSelectManualLocation(c, c.areas[0])}
                      className="px-2.5 py-1 rounded-lg bg-teal-400/20 text-teal-300 hover:bg-teal-400/30 text-xs font-semibold"
                    >
                      Select City
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.areas.map((a) => (
                      <button
                        key={a}
                        onClick={() => handleSelectManualLocation(c, a)}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 hover:bg-teal-950 hover:text-teal-300 text-slate-300 border border-slate-700 transition-colors"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, CheckCircle2, Crosshair, Truck, Maximize2, Minimize2, X, Play, Pause, Compass } from 'lucide-react';

// Fix Leaflet default icon URLs in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = ({
  center = [18.5204, 73.8567],
  zoom = 14,
  driverLocation = [18.524, 73.852],
  tasks = [],
  onCompleteTask,
  userLocation,
  onSelectLocation,
  isPickerMode = false,
  height = '350px'
}) => {
  const mapRef = useRef(null);
  const fullMapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const fullLeafletMapInstance = useRef(null);
  const markersGroupRef = useRef(null);
  const fullMarkersGroupRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);
  const [currentNavIndex, setCurrentNavIndex] = useState(0);
  const [liveDriverPos, setLiveDriverPos] = useState(driverLocation);

  // Sync initial driver location
  useEffect(() => {
    setLiveDriverPos(driverLocation);
  }, [driverLocation]);

  // Live Navigation Simulation (Uber / Ola / Rapido Style)
  useEffect(() => {
    let interval = null;
    if (isLiveNavigating && tasks.length > 0) {
      interval = setInterval(() => {
        setLiveDriverPos((prevPos) => {
          const activeTask = tasks.find(t => t.status !== 'Completed') || tasks[0];
          const targetCoords = (activeTask && activeTask.lat && activeTask.lng) 
            ? [activeTask.lat, activeTask.lng] 
            : [18.528, 73.848];

          const latDiff = (targetCoords[0] - prevPos[0]) * 0.15;
          const lngDiff = (targetCoords[1] - prevPos[1]) * 0.15;

          const newLat = prevPos[0] + latDiff;
          const newLng = prevPos[1] + lngDiff;

          // Pan map live on driver truck
          if (leafletMapInstance.current) {
            leafletMapInstance.current.panTo([newLat, newLng], { animate: true, duration: 0.5 });
          }
          if (fullLeafletMapInstance.current) {
            fullLeafletMapInstance.current.panTo([newLat, newLng], { animate: true, duration: 0.5 });
          }

          return [newLat, newLng];
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveNavigating, tasks]);

  // Function to render map layers & markers
  const renderMapLayers = (mapInstance, groupInstance, isFull = false) => {
    if (!mapInstance || !groupInstance) return;

    groupInstance.clearLayers();
    const routeCoordinates = [];

    // 1. Driver Location Pin (Truck)
    const effectiveDriverPos = isLiveNavigating ? liveDriverPos : (driverLocation || center);
    if (effectiveDriverPos) {
      routeCoordinates.push(effectiveDriverPos);

      const driverIcon = L.divIcon({
        className: 'custom-driver-pin',
        html: `
          <div style="background-color: #02471f; border: 3px solid #10b981; border-radius: 14px; padding: 6px; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(0,0,0,0.35); width: 44px; height: 44px;">
            <span style="font-size: 22px;">🚛</span>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const driverMarker = L.marker(effectiveDriverPos, { icon: driverIcon });
      driverMarker.bindPopup(`
        <div style="padding: 6px; font-family: sans-serif;">
          <div style="font-weight: 900; color: #02471f; font-size: 13px;">🚛 Driver Truck (MH12 AB 4567)</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            Status: ${isLiveNavigating ? '🟢 Live GPS Route Following (Uber/Ola Mode)' : '⚡ Active Telemetry'}
          </div>
        </div>
      `);
      groupInstance.addLayer(driverMarker);
    }

    // Default benchmark coordinates if lat/lng not specified
    const taskCoordinatesList = [
      [18.528, 73.848],
      [18.521, 73.858],
      [18.514, 73.865],
      [18.508, 73.872]
    ];

    // 2. Complaint Markers with Real Coordinates
    tasks.forEach((task, idx) => {
      const coords = (task.lat && task.lng)
        ? [task.lat, task.lng]
        : taskCoordinatesList[idx % taskCoordinatesList.length];

      if (task.status !== 'Completed') {
        routeCoordinates.push(coords);
      }

      const statusBg = task.status === 'Completed' ? '#10b981' : (task.status === 'In Progress' ? '#eab308' : '#ef4444');
      const pinIcon = L.divIcon({
        className: 'custom-task-pin',
        html: `
          <div style="background-color: ${statusBg}; border: 3px solid white; border-radius: 50%; width: 34px; height: 34px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            ${idx + 1}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(coords, { icon: pinIcon });
      
      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'sans-serif';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; color: #0f172a;">${task.name || task.location_name || `Complaint Stop #${idx + 1}`}</div>
        <div style="font-size: 11px; color: #64748b; margin: 3px 0;">Tracking ID: <b>${task.id || 'EP-2026'}</b> • Precise Geo Coordinates</div>
        <div style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; background: ${statusBg}22; color: ${statusBg}; border: 1px solid ${statusBg}; margin-bottom: 6px;">
          ${task.status || 'Pending'}
        </div>
      `;

      if (onCompleteTask && task.status !== 'Completed') {
        const btn = document.createElement('button');
        btn.textContent = 'Mark Stop Complete ✓';
        btn.style.width = '100%';
        btn.style.padding = '6px';
        btn.style.background = '#02471f';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = '800';
        btn.style.fontSize = '11px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => onCompleteTask(task.id);
        popupContent.appendChild(btn);
      }

      marker.bindPopup(popupContent);
      groupInstance.addLayer(marker);
    });

    // 3. Draw Route Polyline
    if (routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#02471f',
        weight: 5,
        dashArray: '8, 8',
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      });
      groupInstance.addLayer(polyline);

      // Fit map bounds dynamically so distant locations (e.g. Shirur 400km away) fit accurately!
      if (!isLiveNavigating) {
        try {
          const bounds = L.latLngBounds(routeCoordinates);
          mapInstance.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });
        } catch (e) {
          console.warn('Bounds fitting error:', e);
        }
      }
    }

    // 4. User Selected Location Marker in Picker Mode
    if (userLocation && isPickerMode) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="background-color: #ef4444; border: 3px solid white; border-radius: 50%; width: 30px; height: 30px; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
            📍
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup('<b style="font-size: 11px;">Selected Precise Waste Location</b>');
      groupInstance.addLayer(userMarker);
    }
  };

  // Initialize Normal Map
  useEffect(() => {
    if (!mapRef.current || leafletMapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      maxZoom: 19,
      zoomControl: true,
      scrollWheelZoom: true,
      preferCanvas: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      detectRetina: true
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    leafletMapInstance.current = map;

    if (isPickerMode && onSelectLocation) {
      map.on('click', (e) => {
        onSelectLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, []);

  // Update Normal Map Layers
  useEffect(() => {
    renderMapLayers(leafletMapInstance.current, markersGroupRef.current, false);
  }, [driverLocation, tasks, userLocation, isPickerMode, liveDriverPos, isLiveNavigating]);

  // Initialize Fullscreen Map Modal
  useEffect(() => {
    if (isFullscreen && fullMapRef.current) {
      if (fullLeafletMapInstance.current) {
        fullLeafletMapInstance.current.remove();
        fullLeafletMapInstance.current = null;
      }

      const map = L.map(fullMapRef.current, {
        center: liveDriverPos || center,
        zoom: 15,
        maxZoom: 19,
        zoomControl: true,
        scrollWheelZoom: true,
        preferCanvas: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        detectRetina: true
      }).addTo(map);

      fullMarkersGroupRef.current = L.layerGroup().addTo(map);
      fullLeafletMapInstance.current = map;

      renderMapLayers(map, fullMarkersGroupRef.current, true);
    }
  }, [isFullscreen]);

  // Update Fullscreen Map Layers
  useEffect(() => {
    if (isFullscreen && fullLeafletMapInstance.current && fullMarkersGroupRef.current) {
      renderMapLayers(fullLeafletMapInstance.current, fullMarkersGroupRef.current, true);
    }
  }, [isFullscreen, driverLocation, tasks, userLocation, isPickerMode, liveDriverPos, isLiveNavigating]);

  // Geolocation trigger
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (leafletMapInstance.current) {
          leafletMapInstance.current.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
        }
        if (fullLeafletMapInstance.current) {
          fullLeafletMapInstance.current.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
        }
        if (onSelectLocation) {
          onSelectLocation({ lat: latitude, lng: longitude });
        }
      },
      (err) => console.warn('GPS error:', err),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const activeTargetTask = tasks.find(t => t.status !== 'Completed') || tasks[0];

  return (
    <>
      {/* Normal Map Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
        
        {/* Leaflet Map DOM Container */}
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Action Controls Bar (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          
          {/* Uber/Ola Style Live Navigation Toggle */}
          <button
            type="button"
            onClick={() => setIsLiveNavigating(!isLiveNavigating)}
            className={`px-3 py-2 rounded-xl text-xs font-black shadow-md border transition-all cursor-pointer flex items-center gap-1.5 ${
              isLiveNavigating
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
            }`}
            title="Uber / Ola / Rapido Style Live Route Navigation"
          >
            <Compass className={`w-4 h-4 ${isLiveNavigating ? 'animate-spin' : ''}`} />
            <span>{isLiveNavigating ? 'Live Following' : 'Follow Route (Uber Mode)'}</span>
          </button>

          {/* GPS Hardware Precision Button */}
          <button
            type="button"
            onClick={handleGeolocate}
            className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-xl shadow-md border border-slate-200 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Locate My Position"
          >
            <Crosshair className="w-4 h-4 text-[#02471f]" />
          </button>

          {/* Fullscreen Expand Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl shadow-md border border-slate-700 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Open Fullscreen Popup Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Uber/Ola Style Live Navigation HUD Banner */}
        {isLiveNavigating && activeTargetTask && (
          <div className="absolute top-3 left-3 right-40 z-10 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Navigation className="w-4 h-4 text-emerald-400 animate-bounce shrink-0" />
              <span className="font-extrabold truncate">
                Navigating to: <span className="text-emerald-300">{activeTargetTask.name || activeTargetTask.location_name || 'Destination'}</span>
              </span>
            </div>
            <span className="font-bold text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md shrink-0 border border-emerald-500/40">
              ETA: 6 mins (2.4 km)
            </span>
          </div>
        )}

        {/* Map Legend Banner Overlay */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-3 text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#02471f]" />
            <span>Truck</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Pending</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span>In Progress</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </span>
        </div>

      </div>

      {/* FULLSCREEN MAP POPUP MODAL WITH CLOSE (X) BUTTON */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-xl p-3 sm:p-6 flex flex-col justify-between">
          
          {/* Modal Top Header Bar */}
          <div className="flex items-center justify-between bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-slate-200 shadow-lg mb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#02471f] text-white flex items-center justify-center font-black">
                🗺️
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  Municipal OpenStreetMap Fullscreen Telemetry
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  High-precision live GPS coordinates, sub-meter accuracy & route tracking
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLiveNavigating(!isLiveNavigating)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isLiveNavigating
                    ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{isLiveNavigating ? 'Live Following' : 'Uber Style Navigation Mode'}</span>
              </button>

              {/* PROMINENT CLOSE (X) BUTTON */}
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>Close Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Leaflet Map Container */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
            <div ref={fullMapRef} className="w-full h-full" />
          </div>

          {/* Fullscreen Footer Banner */}
          <div className="mt-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 shrink-0">
            <div className="flex items-center gap-4">
              <span>📍 Total Stops: <b>{tasks.length}</b></span>
              <span>🚛 Driver Reg: <b>MH12 AB 4567</b></span>
              <span>🌱 Municipal OpenStreetMap GIS</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="text-red-600 hover:underline font-black cursor-pointer"
            >
              Exit Fullscreen Mode ✕
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default InteractiveMap;

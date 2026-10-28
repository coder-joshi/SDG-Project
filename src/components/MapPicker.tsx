import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: string;
  readOnly?: boolean;
}

// Custom Green Pin DivIcon (pure CSS & SVG, zero external asset dependencies)
const createMapPinIcon = (color: string = '#1E6B3A') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="
          width: 28px;
          height: 28px;
          background-color: ${color};
          border: 2.5px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Map click & pan handler
const MapClickHandler: React.FC<{
  onSelect: (lat: number, lng: number) => void;
  readOnly?: boolean;
}> = ({ onSelect, readOnly }) => {
  useMapEvents({
    click(e) {
      if (!readOnly) {
        onSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
      }
    }
  });
  return null;
};

// Recenter component when coordinates change externally
const RecenterView: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
};

export const MapPicker: React.FC<MapPickerProps> = ({
  lat,
  lng,
  onChange,
  height = '320px',
  readOnly = false
}) => {
  const pinIcon = useMemo(() => createMapPinIcon('#1E6B3A'), []);
  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onChange({
            lat: Number(newPos.lat.toFixed(6)),
            lng: Number(newPos.lng.toFixed(6))
          });
        }
      }
    }),
    [onChange]
  );

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6))
          });
        },
        (err) => {
          console.warn('Geolocation failed or denied, using central India default:', err);
          // Central India default (Madhya Pradesh / Sehore)
          onChange({ lat: 23.2032, lng: 77.0844 });
        }
      );
    } else {
      onChange({ lat: 23.2032, lng: 77.0844 });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <div style={{ height, width: '100%' }}>
          <MapContainer
            center={[lat || 22.9734, lng || 78.6569]}
            zoom={lat ? 9 : 5}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler
              onSelect={(clickedLat, clickedLng) => onChange({ lat: clickedLat, lng: clickedLng })}
              readOnly={readOnly}
            />
            <RecenterView lat={lat} lng={lng} />
            {lat && lng && (
              <Marker
                position={[lat, lng]}
                draggable={!readOnly}
                eventHandlers={eventHandlers}
                ref={markerRef}
                icon={pinIcon}
              />
            )}
          </MapContainer>
        </div>

        {/* Floating "Use my location" button */}
        {!readOnly && (
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="absolute top-3 right-3 z-[25] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-xs font-semibold text-slate-800 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Use my location</span>
          </button>
        )}
      </div>

      {/* Lat/Lng display strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Coordinates:</span>
        </span>
        <div className="flex items-center gap-3">
          <span>
            Lat: <strong className="text-slate-800 tabular-nums">{lat ? lat.toFixed(4) : '--'}</strong>
          </span>
          <span>
            Lng: <strong className="text-slate-800 tabular-nums">{lng ? lng.toFixed(4) : '--'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

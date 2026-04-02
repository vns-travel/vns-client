import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search, Loader2 } from "lucide-react";

// Fix leaflet's missing default marker icons when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Vietnam bounding box center
const VIETNAM_CENTER = [16.0, 106.0];
const DEFAULT_ZOOM = 6;

/**
 * Calls Nominatim reverse geocoding and returns parsed address fields.
 * Rate-limit: 1 req/s per Nominatim policy — we debounce on the caller side.
 */
async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "vi" },
  });
  if (!res.ok) throw new Error("Nominatim error");
  const json = await res.json();
  const a = json.address || {};

  // Vietnamese admin hierarchy: city / district / ward
  const city =
    a.city || a.town || a.county || a.state_district || a.state || "";
  const district =
    a.city_district || a.suburb || a.municipality || a.district || "";
  const ward = a.quarter || a.neighbourhood || a.village || a.hamlet || "";
  const road = a.road || a.pedestrian || a.footway || "";
  const houseNumber = a.house_number || "";
  const address = [houseNumber, road].filter(Boolean).join(" ").trim();
  const postalCode = a.postcode || "";

  return {
    displayName: json.display_name || "",
    city,
    district,
    ward,
    address,
    postalCode,
    latitude: lat,
    longitude: lng,
  };
}

/**
 * Calls Nominatim forward geocoding to search a place by name (biased to Vietnam).
 */
async function forwardGeocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=vn&addressdetails=1&accept-language=vi`;
  const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
  if (!res.ok) return [];
  return res.json();
}

/** Inner component: listens for map clicks and moves the marker. */
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * LocationMapPicker
 *
 * Props:
 *   value   — { latitude, longitude, city, district, ward, address, postalCode }
 *   onChange — called with the same shape after the user picks a point
 *   label   — optional section label string
 */
const LocationMapPicker = ({ value, onChange, label = "Vị trí dịch vụ" }) => {
  const [markerPos, setMarkerPos] = useState(
    value?.latitude && value?.longitude
      ? [value.latitude, value.longitude]
      : null
  );
  const [resolvedAddress, setResolvedAddress] = useState(
    value?.displayName || ""
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const mapRef = useRef(null);
  const geocodeTimer = useRef(null);

  const handleMapClick = useCallback(
    (lat, lng) => {
      setMarkerPos([lat, lng]);
      setLoading(true);
      setResolvedAddress("");

      // Debounce so rapid clicks don't fire multiple Nominatim requests
      clearTimeout(geocodeTimer.current);
      geocodeTimer.current = setTimeout(async () => {
        try {
          const result = await reverseGeocode(lat, lng);
          setResolvedAddress(result.displayName);
          onChange(result);
        } catch {
          setResolvedAddress("Không thể lấy địa chỉ.");
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [onChange]
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const results = await forwardGeocode(searchQuery);
      setSearchResults(results);
    } catch {
      // silently ignore
    } finally {
      setSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMarkerPos([lat, lng]);
    setSearchResults([]);
    setSearchQuery("");
    // Pan the map
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14);
    }
    handleMapClick(lat, lng);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="inline w-4 h-4 mr-1 text-primary" />
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Search box */}
      <div className="flex gap-2 mb-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          placeholder="Tìm kiếm địa điểm tại Việt Nam..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-60"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-12 z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {searchResults.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => selectSearchResult(r)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 360 }}>
        <MapContainer
          center={
            markerPos ||
            (value?.latitude && value?.longitude
              ? [value.latitude, value.longitude]
              : VIETNAM_CENTER)
          }
          zoom={markerPos ? 14 : DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={handleMapClick} />
          {markerPos && <Marker position={markerPos} />}
        </MapContainer>
      </div>

      {/* Resolved address */}
      <div className="mt-2 min-h-[24px] text-sm text-gray-600 flex items-center gap-1.5">
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            Đang lấy địa chỉ...
          </>
        ) : resolvedAddress ? (
          <>
            <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span>{resolvedAddress}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">
            Nhấp vào bản đồ để chọn vị trí dịch vụ.
          </span>
        )}
      </div>
    </div>
  );
};

export default LocationMapPicker;

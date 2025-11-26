"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation, Edit } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import useToastStore from "../../../store/toastStore";
import OrderTypeSelector from "./OrderTypeSelector";
import api from "../../../api";

// Sofia constants
const SOFIA_CENTER = [42.6977, 23.3219];
const SOFIA_BOUNDS = [[42.60, 23.20], [42.80, 23.50]];
const SOFIA_BOUNDS_CHECK = { minLat: 42.60, maxLat: 42.80, minLng: 23.20, maxLng: 23.50 };

const isInSofia = (lat, lng) => 
  lat >= SOFIA_BOUNDS_CHECK.minLat && lat <= SOFIA_BOUNDS_CHECK.maxLat &&
  lng >= SOFIA_BOUNDS_CHECK.minLng && lng <= SOFIA_BOUNDS_CHECK.maxLng;

export default function ShippingAddressSection({ formData, setFormData }) {
  const { orderType, setDeliveryCharge } = useCartStore();
  const { error: toastError, success: toastSuccess } = useToastStore();
  const isDelivery = orderType === 'delivery';
  
  const [loading, setLoading] = useState({ quote: false, map: false, location: false, geocoding: false });
  const [deliveryQuote, setDeliveryQuote] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const leafletLoadedRef = useRef(false);
  const lastGeocodeTimeRef = useRef(0);

  // Fetch delivery quote
  const fetchDeliveryQuote = useCallback(async (dropoff) => {
    if (!dropoff?.lat || !dropoff?.lng || !dropoff?.address) return;

    setLoading(prev => ({ ...prev, quote: true }));
    setDeliveryQuote(null);

    try {
      const response = await api.delivery.getDeliveryQuote(dropoff);
      if (response.success && response.data) {
        const quote = response.data;
        setDeliveryQuote(quote);
        if (quote.fee_bgn) setDeliveryCharge(quote.fee_bgn);
        setFormData(prev => ({ ...prev, quote_id: quote.quote_id }));
      } else {
        const errorCode = response?.data?.error_code || response?.error_code;
        const reason = response?.data?.reason || response?.reason;
        if (errorCode === 'DROPOFF_OUTSIDE_OF_DELIVERY_AREA' || reason?.includes('outside')) {
          toastError('This location is outside our delivery area. Please select a different location.');
          setMapError('This location is outside our delivery area.');
        } else {
          toastError(response.message || response?.data?.message || 'Failed to get delivery quote');
        }
      }
    } catch (error) {
      const errorData = error?.data || error?.response?.data || {};
      const errorCode = errorData.error_code;
      const reason = errorData.reason || errorData.message;
      if (errorCode === 'DROPOFF_OUTSIDE_OF_DELIVERY_AREA' || reason?.includes('outside') || reason?.includes('delivery area')) {
        toastError('This location is outside our delivery area. Please select a different location.');
        setMapError('This location is outside our delivery area.');
      } else {
        toastError(error?.message || errorData?.message || 'Failed to get delivery quote. Please try again.');
      }
    } finally {
      setLoading(prev => ({ ...prev, quote: false }));
    }
  }, [setDeliveryCharge, setFormData, toastError]);

  // Reverse geocode using Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    const now = Date.now();
    if (now - lastGeocodeTimeRef.current < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastGeocodeTimeRef.current)));
    }
    lastGeocodeTimeRef.current = Date.now();

    setLoading(prev => ({ ...prev, geocoding: true }));
    setShowManualInput(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'DeliveryApp/1.0' } }
      );

      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();

      if (data?.address) {
        const addr = data.address;
        const fullAddress = data.display_name || `${addr.road || ''}, ${addr.city || addr.town || addr.village || ''}`.trim();
        
        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          city: addr.city || addr.town || addr.village || addr.municipality || prev.city,
          state: addr.state || addr.region || prev.state,
          zipCode: addr.postcode || prev.zipCode,
          country: addr.country || prev.country,
          latitude: lat,
          longitude: lng,
        }));

        fetchDeliveryQuote({ lat, lng, address: fullAddress });
      } else {
        setShowManualInput(true);
        toastError('Unable to get address automatically. Please enter it manually.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setShowManualInput(true);
      toastError('Geocoding service unavailable. Please enter address manually.');
    } finally {
      setLoading(prev => ({ ...prev, geocoding: false }));
    }
  }, [setFormData, toastError, fetchDeliveryQuote]);

  // Validate and normalize location to Sofia
  const validateLocation = useCallback((lat, lng) => {
    if (!isInSofia(lat, lng)) {
      toastError('Please select a location within Sofia area only.');
      return SOFIA_CENTER;
    }
    return [lat, lng];
  }, [toastError]);

  // Create marker
  const createMarker = useCallback((position, map = null) => {
    if (!window.L) return;
    const mapInstance = map || mapInstanceRef.current;
    if (!mapInstance) return;

    if (markerRef.current) mapInstance.removeLayer(markerRef.current);

    const marker = window.L.marker([position.lat, position.lng], {
      draggable: false,
      title: 'Delivery Location',
    }).addTo(mapInstance);

    markerRef.current = marker;
  }, []);

  // Update marker position
  const updateMarkerPosition = useCallback((lat, lng) => {
    const [finalLat, finalLng] = validateLocation(lat, lng);
    
    if (markerRef.current) {
      markerRef.current.setLatLng([finalLat, finalLng]);
    } else {
      createMarker({ lat: finalLat, lng: finalLng });
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([finalLat, finalLng], 15);
    }
  }, [validateLocation, createMarker]);

  // Initialize map with location
  const initializeMapWithLocation = useCallback((lat, lng) => {
    if (!mapRef.current || !window.L || mapRef.current._leaflet_id) return;

    const map = window.L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      maxBounds: SOFIA_BOUNDS,
      maxBoundsViscosity: 1.0,
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    createMarker({ lat, lng }, map);
    reverseGeocode(lat, lng);
  }, [createMarker, reverseGeocode]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(SOFIA_CENTER, 12);
        if (!markerRef.current) createMarker({ lat: SOFIA_CENTER[0], lng: SOFIA_CENTER[1] });
        else markerRef.current.setLatLng(SOFIA_CENTER);
        reverseGeocode(SOFIA_CENTER[0], SOFIA_CENTER[1]);
      }
      return;
    }

    setLoading(prev => ({ ...prev, location: true }));
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const [finalLat, finalLng] = isInSofia(lat, lng) ? [lat, lng] : SOFIA_CENTER;
        
        if (!isInSofia(lat, lng)) toastError('Your location is outside Sofia. Defaulting to Sofia center.');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([finalLat, finalLng], isInSofia(lat, lng) ? 15 : 12);
          if (markerRef.current) markerRef.current.setLatLng([finalLat, finalLng]);
          else createMarker({ lat: finalLat, lng: finalLng });
          reverseGeocode(finalLat, finalLng);
        } else {
          initializeMapWithLocation(finalLat, finalLng);
        }
        
        setLoading(prev => ({ ...prev, location: false }));
        if (isInSofia(lat, lng)) toastSuccess('Location found!');
      },
      (error) => {
        setLoading(prev => ({ ...prev, location: false }));
        const messages = {
          [error.PERMISSION_DENIED]: 'Please allow location access.',
          [error.POSITION_UNAVAILABLE]: 'Location information is unavailable.',
          [error.TIMEOUT]: 'Location request timed out.',
        };
        const errorMsg = `Unable to get your location. ${messages[error.code] || 'An unknown error occurred.'}`;
        setMapError(errorMsg);
        toastError(errorMsg);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(SOFIA_CENTER, 12);
          if (!markerRef.current) createMarker({ lat: SOFIA_CENTER[0], lng: SOFIA_CENTER[1] });
          else markerRef.current.setLatLng(SOFIA_CENTER);
          reverseGeocode(SOFIA_CENTER[0], SOFIA_CENTER[1]);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [toastError, toastSuccess, createMarker, reverseGeocode, initializeMapWithLocation]);

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      // If mapRef is not ready, try again after a short delay
      setTimeout(() => {
        if (mapRef.current && window.L) {
          initializeMap();
        }
      }, 100);
      return;
    }
    
    if (!window.L) {
      setMapError('Map library not loaded. Click on the map area to retry.');
      return;
    }
    
    if (mapInstanceRef.current) {
      if (formData.latitude && formData.longitude) {
        mapInstanceRef.current.setView([formData.latitude, formData.longitude], 15);
      }
      return;
    }
    if (mapRef.current._leaflet_id) return;

    try {
      setMapError(null);
      const center = formData.latitude && formData.longitude 
        ? [formData.latitude, formData.longitude] 
        : SOFIA_CENTER;
      const zoom = formData.latitude && formData.longitude ? 15 : 12;

      const map = window.L.map(mapRef.current, {
        center,
        zoom,
        maxBounds: SOFIA_BOUNDS,
        maxBoundsViscosity: 1.0,
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      if (!formData.latitude || !formData.longitude) {
        map.setView(SOFIA_CENTER, 12);
      }

      mapInstanceRef.current = map;

      if (formData.latitude && formData.longitude) {
        createMarker({ lat: formData.latitude, lng: formData.longitude }, map);
        reverseGeocode(formData.latitude, formData.longitude);
      } else {
        // Always initialize with Sofia center
        createMarker({ lat: SOFIA_CENTER[0], lng: SOFIA_CENTER[1] }, map);
        reverseGeocode(SOFIA_CENTER[0], SOFIA_CENTER[1]);
        
        // Try to get user location in background (non-blocking)
        setTimeout(() => {
          getCurrentLocation();
        }, 500);
      }

      if (!map._clickListenerAdded) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          const [finalLat, finalLng] = validateLocation(lat, lng);
          updateMarkerPosition(finalLat, finalLng);
          reverseGeocode(finalLat, finalLng);
        });
        map._clickListenerAdded = true;
      }
    } catch (error) {
      if (error.message?.includes('already initialized')) return;
      setMapError('Failed to initialize map. Click on the map area to retry.');
      toastError('Failed to initialize map. Click on the map area to retry.');
    }
  }, [formData.latitude, formData.longitude, getCurrentLocation, createMarker, reverseGeocode, updateMarkerPosition, validateLocation, toastError]);

  // Load Leaflet
  useEffect(() => {
    if (!isDelivery) return;

    // If Leaflet is already loaded, initialize map immediately
    if (window.L && leafletLoadedRef.current) {
      setLoading(prev => ({ ...prev, map: false }));
      // Small delay to ensure mapRef is ready
      setTimeout(() => {
        initializeMap();
      }, 50);
      return;
    }

    // Load CSS first
    const existingCSS = document.querySelector('link[href*="leaflet.css"]');
    if (!existingCSS) {
      const link = document.createElement('link');
      Object.assign(link, {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
        crossOrigin: '',
      });
      document.head.appendChild(link);
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="leaflet"]');
    if (existingScript) {
      if (window.L) {
        leafletLoadedRef.current = true;
        setLoading(prev => ({ ...prev, map: false }));
        setTimeout(() => {
          initializeMap();
        }, 50);
        return;
      }
      // Script is loading, wait for it
      existingScript.addEventListener('load', () => {
        leafletLoadedRef.current = true;
        setLoading(prev => ({ ...prev, map: false }));
        setTimeout(() => {
          initializeMap();
        }, 50);
      });
      existingScript.addEventListener('error', () => {
        setLoading(prev => ({ ...prev, map: false }));
        setMapError('Failed to load Leaflet.js. Click on the map area to retry.');
        toastError('Failed to load Leaflet.js. Click on the map area to retry.');
      });
      setLoading(prev => ({ ...prev, map: true }));
      return;
    }

    // Load script
    setLoading(prev => ({ ...prev, map: true }));
    leafletLoadedRef.current = false;
    
    const script = document.createElement('script');
    Object.assign(script, {
      src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
      crossOrigin: '',
      id: 'leaflet-script',
    });
    
    script.onload = () => {
      leafletLoadedRef.current = true;
      setLoading(prev => ({ ...prev, map: false }));
      // Small delay to ensure mapRef is ready
      setTimeout(() => {
        initializeMap();
      }, 50);
    };
    
    script.onerror = () => {
      leafletLoadedRef.current = false;
      setLoading(prev => ({ ...prev, map: false }));
      setMapError('Failed to load Leaflet.js. Click on the map area to retry.');
      toastError('Failed to load Leaflet.js. Click on the map area to retry.');
    };
    
    document.head.appendChild(script);

    const mapContainer = mapRef.current;
    const mapInstance = mapInstanceRef.current;
    const marker = markerRef.current;

    return () => {
      if (mapInstance) {
        try {
          mapInstance.off();
          mapInstance.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
      }
      if (marker) {
        try {
          marker.off();
          markerRef.current = null;
        } catch (error) {
          console.warn('Error cleaning up marker:', error);
        }
      }
      if (mapContainer) mapContainer._leaflet_id = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDelivery, initializeMap]);

  const handleManualSubmit = useCallback(() => {
    if (!manualAddress.trim() || !formData.latitude || !formData.longitude) {
      toastError(manualAddress.trim() ? 'Please select a location on the map first' : 'Please enter an address');
      return;
    }

    setFormData(prev => ({ ...prev, address: manualAddress.trim() }));
    fetchDeliveryQuote({ lat: formData.latitude, lng: formData.longitude, address: manualAddress.trim() });
    setShowManualInput(false);
    toastSuccess('Address saved successfully');
  }, [manualAddress, formData.latitude, formData.longitude, setFormData, fetchDeliveryQuote, toastError, toastSuccess]);

  if (!isDelivery) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white fill-white" />
          </motion.div>
          <h3 className="text-white text-2xl font-black uppercase">Pickup Information</h3>
        </div>
        <OrderTypeSelector />
        <div className="p-4 bg-theme3/20 border border-theme3/50 rounded-xl">
          <p className="text-white text-sm">You will pick up your order from the selected branch.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white text-2xl font-black uppercase">Delivery Address</h3>
      </div>

      <OrderTypeSelector />

      <div className="mb-4 flex items-center justify-between gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getCurrentLocation}
          disabled={loading.location || loading.map}
          className="flex items-center gap-2 px-4 py-2 bg-theme3/20 border-2 border-theme3 rounded-xl text-theme3 font-semibold hover:bg-theme3/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.location ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Getting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Use My Current Location</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="mb-4">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border-2 border-white/20">
          {loading.map ? (
            <div className="absolute inset-0 flex items-center justify-center bg-bgimg z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-theme3 animate-spin mx-auto mb-2" />
                <p className="text-text">Loading map...</p>
              </div>
            </div>
          ) : mapError && !mapInstanceRef.current ? (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-bgimg p-4 cursor-pointer hover:bg-bgimg/80 transition-colors z-10"
              onClick={() => {
                setMapError(null);
                setLoading(prev => ({ ...prev, map: true }));
                if (window.L && mapRef.current) {
                  setTimeout(() => {
                    initializeMap();
                    setLoading(prev => ({ ...prev, map: false }));
                  }, 100);
                } else {
                  // Retry loading Leaflet
                  const script = document.querySelector('script[src*="leaflet"]');
                  if (script) {
                    script.addEventListener('load', () => {
                      initializeMap();
                      setLoading(prev => ({ ...prev, map: false }));
                    });
                  } else {
                    window.location.reload();
                  }
                }
              }}
            >
              <div className="text-center max-w-md">
                <p className="text-red-400 mb-3 font-semibold">{mapError}</p>
                <p className="text-text text-sm mb-2">Click here to load the map</p>
                <button className="px-4 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors">
                  Load Map
                </button>
              </div>
            </div>
          ) : (
            <div 
              ref={mapRef} 
              className="w-full h-full"
              onClick={() => {
                // If map is not initialized, try to initialize on click
                if (!mapInstanceRef.current && window.L && mapRef.current) {
                  initializeMap();
                }
              }}
            />
          )}
        </div>
      </div>

      {showManualInput && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <Edit className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-400 font-semibold mb-2">Enter Address Manually</p>
              <p className="text-text text-xs mb-3">Unable to get address automatically. Please enter your delivery address below.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter your full address..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
                <button onClick={handleManualSubmit} className="px-4 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors font-semibold">
                  Save
                </button>
                <button onClick={() => { setShowManualInput(false); setManualAddress(""); }} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {formData.address && !showManualInput && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold mb-1">Selected Address:</p>
              <p className="text-white text-sm mb-2">{formData.address}</p>
              {(formData.city || formData.state || formData.zipCode || formData.country) && (
                <div className="flex flex-wrap gap-2 text-xs text-text">
                  {formData.city && <span>{formData.city}</span>}
                  {formData.state && <span>{formData.state}</span>}
                  {formData.zipCode && <span>{formData.zipCode}</span>}
                  {formData.country && <span>{formData.country}</span>}
                </div>
              )}
              {formData.latitude && formData.longitude && (
                <p className="text-text text-xs mt-2">📍 {Number(formData.latitude).toFixed(6)}, {Number(formData.longitude).toFixed(6)}</p>
              )}
            </div>
            {loading.geocoding && <Loader2 className="w-4 h-4 text-theme3 animate-spin" />}
          </div>
        </motion.div>
      )}

      {loading.quote && (
        <div className="mb-4 p-3 bg-theme3/20 border border-theme3/50 rounded-xl">
          <div className="flex items-center gap-2 text-theme3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Calculating delivery fee...</span>
          </div>
        </div>
      )}

      {deliveryQuote && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-theme3/20 border border-theme3/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text text-sm font-semibold">Delivery Fee:</span>
            <span className="text-theme3 font-bold text-lg">{deliveryQuote.fee_bgn} {deliveryQuote.currency || 'BGN'}</span>
          </div>
          {deliveryQuote.eta_min && (
            <div className="flex items-center justify-between">
              <span className="text-text text-xs">Estimated Time:</span>
              <span className="text-white text-xs font-semibold">{deliveryQuote.eta_min} minutes</span>
            </div>
          )}
        </motion.div>
      )}

      {mapError && mapError.includes('outside our delivery area') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold mb-1">Location Outside Delivery Area</p>
              <p className="text-text text-sm">The selected location is outside our delivery service area. Please select a different location on the map.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
        <p className="text-text text-xs">💡 Click on the map to select your delivery location. Your address will be automatically detected.</p>
      </div>

      <input type="hidden" name="address" value={formData.address || ""} />
      <input type="hidden" name="city" value={formData.city || ""} />
      <input type="hidden" name="state" value={formData.state || ""} />
      <input type="hidden" name="zipCode" value={formData.zipCode || ""} />
      <input type="hidden" name="country" value={formData.country || ""} />
      <input type="hidden" name="latitude" value={formData.latitude || ""} />
      <input type="hidden" name="longitude" value={formData.longitude || ""} />
    </div>
  );
}

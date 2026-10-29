// LocationPicker.tsx
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Loader2,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

type Coordinates = {
  lat: number;
  lon: number;
};

type LocationPickerProps = {
  address: string;
  setAddress: (address: string) => void;
  coordinates: Coordinates | null;
  setCoordinates: (coordinates: Coordinates | null) => void;
};

type GeoapifyFeature = {
  properties?: {
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    lat?: number;
    lon?: number;
    result_type?: string;
  };
};

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY as string | undefined;

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

const locationIcon = L.divIcon({
  className: "eversenior-map-marker",
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #6F5139;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,.3);
    "></div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

async function reverseGeocode(coords: Coordinates): Promise<string> {
  if (!API_KEY) {
    throw new Error("Geoapify API key is missing. Add it to your frontend .env file.");
  }

  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
    format: "json",
    apiKey: API_KEY,
  });

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Couldn't look up this address. Please try again or enter it manually.");
  }

  const data = (await response.json()) as {
    results?: Array<{ formatted?: string }>;
  };

  const formatted = data.results?.[0]?.formatted;

  if (!formatted) {
    throw new Error("No readable address was found for this location. Try moving the map pin.");
  }

  return formatted;
}

function MapCamera({ coordinates }: { coordinates: Coordinates | null }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.flyTo([coordinates.lat, coordinates.lon], 16, { duration: 0.7 });
    }
  }, [coordinates, map]);

  return null;
}

function MapClickHandler({
  onChoose,
}: {
  onChoose: (coords: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onChoose({
        lat: event.latlng.lat,
        lon: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LocationPicker({
  address,
  setAddress,
  coordinates,
  setCoordinates,
}: LocationPickerProps) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);

  const chooseCoordinates = async (coords: Coordinates) => {
    setCoordinates(coords);
    setLocationLoading(true);
    setLocationMessage("Finding the address…");

    try {
      const readableAddress = await reverseGeocode(coords);
      setAddress(readableAddress);
      setLocationMessage("Location selected. You can move the pin to adjust it.");
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : "Couldn't find the address."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Your browser doesn't support location services. Search or enter the address manually.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("Getting your current location…");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setCoordinates(coords);

        try {
          const readableAddress = await reverseGeocode(coords);
          setAddress(readableAddress);
          setLocationMessage("Current location selected.");
        } catch (error) {
          setLocationMessage(
            error instanceof Error ? error.message : "Couldn't find the address."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Allow location access in your browser, or search for an address instead."
            : error.code === error.TIMEOUT
              ? "Your location request timed out. Please try again."
              : "We couldn't get your location. Search for an address or enter it manually.";

        setLocationMessage(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocationMessage("");
    setSuggestions([]);

    if (!API_KEY) {
      setLocationMessage("Geoapify API key is missing. Add it to your frontend .env file.");
      return;
    }

    if (searchText.trim().length < 3) {
      setLocationMessage("Enter at least 3 characters to search for a location.");
      return;
    }

    setSearchLoading(true);

    try {
      const params = new URLSearchParams({
        text: searchText.trim(),
        format: "json",
        limit: "5",
        filter: "countrycode:in",
        apiKey: API_KEY,
      });

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Address search failed. Check your Geoapify API key and try again.");
      }

      const data = (await response.json()) as {
        results?: Array<{
          formatted?: string;
          lat?: number;
          lon?: number;
          address_line1?: string;
          address_line2?: string;
        }>;
      };

      const results = (data.results ?? [])
        .filter(
          (item) =>
            typeof item.lat === "number" &&
            typeof item.lon === "number"
        )
        .map((item) => ({
          properties: {
            formatted: item.formatted,
            lat: item.lat,
            lon: item.lon,
            address_line1: item.address_line1,
            address_line2: item.address_line2,
          },
        }));

      if (results.length === 0) {
        setLocationMessage("No matching addresses found. Try a more specific search.");
      } else {
        setSuggestions(results);
      }
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : "Address search failed."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChooseSuggestion = (result: GeoapifyFeature) => {
    const properties = result.properties;
    if (
      typeof properties?.lat !== "number" ||
      typeof properties?.lon !== "number"
    ) {
      return;
    }

    setSuggestions([]);
    setSearchText(properties.formatted ?? "");
    void chooseCoordinates({
      lat: properties.lat,
      lon: properties.lon,
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="location-search"
          className="mb-2 block text-sm font-medium"
        >
          Search for an address
        </label>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            id="location-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search street, area, city or PIN code"
            className="min-w-0 flex-1 rounded-xl border border-[#E2DBD0] bg-white px-4 py-3 text-sm outline-none focus:border-[#6F5139]"
          />

          <button
            type="submit"
            disabled={searchLoading}
            aria-label="Search address"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {searchLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-2 overflow-hidden rounded-xl border border-[#E2DBD0] bg-white shadow-sm">
            {suggestions.map((result, index) => (
              <button
                key={`${result.properties?.lat}-${result.properties?.lon}-${index}`}
                type="button"
                onClick={() => handleChooseSuggestion(result)}
                className="flex w-full items-start gap-3 border-b border-[#EDE7DE] px-4 py-3 text-left text-sm last:border-b-0 hover:bg-[#FBF8F3]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6F5139]" />
                <span>{result.properties?.formatted ?? "Address result"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={locationLoading}
        className="inline-flex items-center gap-2 rounded-xl border border-[#E2DBD0] px-4 py-3 text-sm font-medium text-[#6F5139] hover:bg-[#FBF8F3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {locationLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
        Use my current location
      </button>

      {locationMessage && (
        <p
          role="status"
          className="text-sm leading-5 text-[#76685D]"
        >
          {locationMessage}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E2DBD0]">
        <div className="flex items-center justify-between gap-3 bg-[#FBF8F3] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#30271F]">Choose meeting point</p>
            <p className="mt-1 text-xs text-[#76685D]">
              Click the map to place or move the pin.
            </p>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-[#6F5139]" />
        </div>

        <MapContainer
          center={
            coordinates
              ? [coordinates.lat, coordinates.lon]
              : DEFAULT_CENTER
          }
          zoom={coordinates ? 15 : 5}
          scrollWheelZoom
          className="h-[320px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
            url={`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${API_KEY ?? ""}`}
          />

          <MapCamera coordinates={coordinates} />
          <MapClickHandler onChoose={(coords) => void chooseCoordinates(coords)} />

          {coordinates && (
            <Marker
              position={[coordinates.lat, coordinates.lon]}
              icon={locationIcon}
            />
          )}
        </MapContainer>
      </div>

      <div>
        <label
          htmlFor="meeting-address"
          className="mb-2 block text-sm font-medium"
        >
          Selected meeting address
        </label>
        <textarea
          id="meeting-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          rows={3}
          placeholder="Choose a location on the map or enter the complete address here"
          className="w-full rounded-xl border border-[#E2DBD0] px-4 py-3 outline-none focus:border-[#6F5139]"
        />
        <p className="mt-2 text-xs leading-5 text-[#76685D]">
          Check the address before continuing. You can edit it manually if the map result needs correction.
        </p>
      </div>

      {coordinates && (
        <p className="text-xs text-[#76685D]">
          Selected map coordinates: {coordinates.lat.toFixed(5)}, {coordinates.lon.toFixed(5)}
        </p>
      )}
    </div>
  );
}
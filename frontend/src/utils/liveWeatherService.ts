// Open-Meteo Real-Time Meteorological Telemetry Service for Ladakh & High-Altitude Sectors
// Completely free and open — requires no API key. Graceful offline fallback.

export interface LocationWeather {
  locationId: string;
  name: string;
  altitudeM: number;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  snowfallCm: number;
  weatherCode: number;
  conditionText: string;
  passStatus: 'OPEN' | 'WARNING' | 'CLOSED';
  lastUpdated: string;
  isLive: boolean;
}

export const TACTICAL_WEATHER_NODES = [
  { id: 'leh', name: 'Leh Command Hub', lat: 34.1526, lng: 77.5771, altitudeM: 3524 },
  { id: 'khardungla', name: 'Khardung La Pass', lat: 34.2787, lng: 77.6047, altitudeM: 5359 },
  { id: 'thoise', name: 'Thoise Air Base', lat: 34.6540, lng: 77.4220, altitudeM: 3180 },
  { id: 'dbo', name: 'OP Daulat Beg Oldi', lat: 35.4022, lng: 77.9324, altitudeM: 5065 },
  { id: 'siachen', name: 'Siachen Base Camp', lat: 35.2000, lng: 77.1500, altitudeM: 3650 },
  { id: 'darbuk', name: 'Darbuk Staging Post', lat: 34.1500, lng: 78.1400, altitudeM: 3850 }
];

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog & Freezing Mist',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Freezing Drizzle',
  71: 'Slight Snowfall',
  73: 'Moderate Snowfall',
  75: 'Heavy Snowfall',
  77: 'Snow Grains',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Blizzard',
  95: 'Thunderstorm'
};

// Fallback high-altitude winter averages (offline safe)
const FALLBACK_WEATHER: Record<string, Omit<LocationWeather, 'lastUpdated' | 'isLive'>> = {
  leh: {
    locationId: 'leh',
    name: 'Leh Command Hub',
    altitudeM: 3524,
    temperatureC: -6.4,
    humidityPct: 45,
    windSpeedKmh: 14.2,
    windDirectionDeg: 280,
    snowfallCm: 0,
    weatherCode: 1,
    conditionText: 'Mainly Clear',
    passStatus: 'OPEN'
  },
  khardungla: {
    locationId: 'khardungla',
    name: 'Khardung La Pass',
    altitudeM: 5359,
    temperatureC: -18.8,
    humidityPct: 78,
    windSpeedKmh: 34.5,
    windDirectionDeg: 310,
    snowfallCm: 0.2,
    weatherCode: 71,
    conditionText: 'Freezing Drift · High Wind',
    passStatus: 'WARNING'
  },
  thoise: {
    locationId: 'thoise',
    name: 'Thoise Air Base',
    altitudeM: 3180,
    temperatureC: -8.1,
    humidityPct: 52,
    windSpeedKmh: 18.0,
    windDirectionDeg: 290,
    snowfallCm: 0,
    weatherCode: 2,
    conditionText: 'Partly Cloudy · Good Visibility',
    passStatus: 'OPEN'
  },
  dbo: {
    locationId: 'dbo',
    name: 'OP Daulat Beg Oldi',
    altitudeM: 5065,
    temperatureC: -24.2,
    humidityPct: 62,
    windSpeedKmh: 28.6,
    windDirectionDeg: 330,
    snowfallCm: 0.1,
    weatherCode: 77,
    conditionText: 'Sub-Zero Freeze · Snow Grains',
    passStatus: 'OPEN'
  },
  siachen: {
    locationId: 'siachen',
    name: 'Siachen Base Camp',
    altitudeM: 3650,
    temperatureC: -15.5,
    humidityPct: 72,
    windSpeedKmh: 22.0,
    windDirectionDeg: 300,
    snowfallCm: 0.4,
    weatherCode: 73,
    conditionText: 'Moderate Glacial Snowfall',
    passStatus: 'WARNING'
  },
  darbuk: {
    locationId: 'darbuk',
    name: 'Darbuk Staging Post',
    altitudeM: 3850,
    temperatureC: -10.2,
    humidityPct: 50,
    windSpeedKmh: 16.5,
    windDirectionDeg: 275,
    snowfallCm: 0,
    weatherCode: 1,
    conditionText: 'Cold & Clear',
    passStatus: 'OPEN'
  }
};

export class LiveWeatherService {
  private static cachedData: Record<string, LocationWeather> = {};
  private static lastFetchTime: number = 0;
  private static CACHE_DURATION_MS = 1000 * 60 * 5; // 5-minute cache to avoid rate limits

  public static async fetchTacticalWeather(): Promise<Record<string, LocationWeather>> {
    const now = Date.now();
    if (now - this.lastFetchTime < this.CACHE_DURATION_MS && Object.keys(this.cachedData).length > 0) {
      return this.cachedData;
    }

    try {
      const lats = TACTICAL_WEATHER_NODES.map(n => n.lat).join(',');
      const lngs = TACTICAL_WEATHER_NODES.map(n => n.lng).join(',');

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,snowfall&timezone=Asia%2FKolkata`;

      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const results: Record<string, LocationWeather> = {};
      const currentTimeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';

      // Open-Meteo returns array of results when multiple coordinates are queried
      const dataList = Array.isArray(data) ? data : [data];

      TACTICAL_WEATHER_NODES.forEach((node, index) => {
        const item = dataList[index];
        if (item && item.current) {
          const c = item.current;
          const code = c.weather_code || 0;
          const temp = Math.round(c.temperature_2m * 10) / 10;
          const wind = Math.round(c.wind_speed_10m * 10) / 10;
          const snow = c.snowfall || 0;

          // Tactical pass classification logic
          let passStatus: 'OPEN' | 'WARNING' | 'CLOSED' = 'OPEN';
          if (wind > 45 || snow > 0.8 || temp < -28) {
            passStatus = 'CLOSED';
          } else if (wind > 28 || snow > 0.2 || temp < -20) {
            passStatus = 'WARNING';
          }

          results[node.id] = {
            locationId: node.id,
            name: node.name,
            altitudeM: node.altitudeM,
            temperatureC: temp,
            humidityPct: c.relative_humidity_2m || 50,
            windSpeedKmh: wind,
            windDirectionDeg: c.wind_direction_10m || 0,
            snowfallCm: snow,
            weatherCode: code,
            conditionText: WEATHER_CODE_DESCRIPTIONS[code] || 'Scattered Cloud',
            passStatus,
            lastUpdated: currentTimeStr,
            isLive: true
          };
        } else {
          // Fallback if index missing
          results[node.id] = {
            ...FALLBACK_WEATHER[node.id],
            lastUpdated: currentTimeStr,
            isLive: false
          };
        }
      });

      this.cachedData = results;
      this.lastFetchTime = now;
      return results;
    } catch (err) {
      console.warn('RASAD-AI: Weather API offline or blocked, switching to offline telemetry cache.', err);
      const currentTimeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
      const fallbackResults: Record<string, LocationWeather> = {};
      Object.keys(FALLBACK_WEATHER).forEach(id => {
        fallbackResults[id] = {
          ...FALLBACK_WEATHER[id],
          lastUpdated: currentTimeStr,
          isLive: false
        };
      });
      this.cachedData = fallbackResults;
      return fallbackResults;
    }
  }

  public static getFallbackSync(): Record<string, LocationWeather> {
    const currentTimeStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
    const fallbackResults: Record<string, LocationWeather> = {};
    Object.keys(FALLBACK_WEATHER).forEach(id => {
      fallbackResults[id] = {
        ...FALLBACK_WEATHER[id],
        lastUpdated: currentTimeStr,
        isLive: false
      };
    });
    return fallbackResults;
  }
}

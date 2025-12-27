
export interface WeatherData {
    daily: {
        time: string[];
        weathercode: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

export async function getTwoweekWeather() {
    // Emerald Isle, NC: 34.6452, -77.0755
    // Fetching 2 weeks covers the trip duration comfortably
    const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=34.6452&longitude=-77.0755&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=14',
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;
    return await res.json() as WeatherData;
}

export function getWeatherIcon(code: number) {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51, 53, 55: Drizzle
    // 61, 63, 65: Rain
    // 71, 73, 75: Snow
    // 80, 81, 82: Rain showers
    // 95, 96, 99: Thunderstorm

    switch (code) {
        case 0: return '☀️';
        case 1:
        case 2: return '🌤';
        case 3: return '☁️';
        case 45:
        case 48: return '🌫';
        case 51:
        case 53:
        case 55: return '🌦';
        case 61:
        case 63:
        case 65: return '🌧';
        case 71:
        case 73:
        case 75: return '❄️';
        case 80:
        case 81:
        case 82: return '🌦';
        case 95:
        case 96:
        case 99: return '⛈';
        default: return '🌡';
    }
}

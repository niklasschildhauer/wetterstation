import { IndoorRoomData, OutdoorWeatherData, WeatherHistoryByDayData, PollenData, WeatherForecastData, WeatherHistoryData, WeatherType, Tile, TileType, WeatherData } from '../weather';
import { Pollen } from '../user-context';

export var OUTDOORWEATHER: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date,
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var FORECAST: WeatherForecastData = {
    forecast: "Besser"
}

export var FORECASTTILE: Tile<WeatherForecastData> = {
    type: TileType.forecast,
    data: FORECAST,
}

export var ESCHE: PollenData =  {
    name: "Esche",
    type: Pollen.Esche,
    today: 0,
    tomorrow: 0,
}

export var ROGGEN: PollenData =  {
    name: "Roggen",
    type: Pollen.Roggen,
    today: 1,
    tomorrow: 0,
}

export var HASEL: PollenData =  {
    name: "Hasel",
    type: Pollen.Hasel,
    today: 1,
    tomorrow: 0,
}

export var BIRKE: PollenData =  {
    name: "Birke",
    type: Pollen.Birke,
    today: 2,
    tomorrow: 0,
}

export var AMBROSIA: PollenData =  {
    name: "Ambrosia",
    type: Pollen.Ambrosia,
    today: 3,
    tomorrow: 0,
}

export var POLLEN: PollenData[] = [
    ESCHE,
    ROGGEN,
    HASEL,
    AMBROSIA,
    BIRKE,
    {
        name: "Beifuß",
        type: Pollen.Beifuss,
        today: 0,
        tomorrow: 0,
    },

    {
        name: "Gräser",
        type: Pollen.Graeser,
        today: 1,
        tomorrow: 0,
    },

    {
        name: "Erle",
        type: Pollen.Erle,
        today: 0,
        tomorrow: 0,
    },
];


export var POLLENSMALL: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: ESCHE
}
  
export var POLLENSMALL2: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: BIRKE
}
  
export var POLLENLIST: Tile<PollenData[]> = {
    type: TileType.pollenList,
    data: POLLEN
}

export var WOHNZIMMER: IndoorRoomData = {
    roomID: "328959845524",
    roomName: "Wohnzimmer",
    airQuality: 42,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
}

export var SCHLAFZIMMER: IndoorRoomData =  {
    roomID: "15359845524",
    roomName: "Schlafzimmer",
    airQuality: 122,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
}


export var INDOORAIRQUALITY: IndoorRoomData[] = [
    WOHNZIMMER,
    SCHLAFZIMMER
];

export var INDOORROOM1: Tile<IndoorRoomData> = {
    type: TileType.indoorRoom,
    data: WOHNZIMMER
}
  
export var INDOORROOM2: Tile<IndoorRoomData> = {
    type: TileType.indoorRoom,
    data: SCHLAFZIMMER
}

export var WEATHERHISTORY: WeatherHistoryData = {
    datapoints: [
        OUTDOORWEATHER,
        OUTDOORWEATHER,
        OUTDOORWEATHER,
    ]
}

export var WEATHERHISTORYBYDAY: WeatherHistoryByDayData = {
    averageHumidity: 40,
    averageTemperature: 20,
}


export var DASHBOARDTILES: Tile<WeatherData>[] = [
    FORECASTTILE,
    INDOORROOM1,
    POLLENLIST,
    INDOORROOM2,
    POLLENSMALL,
    POLLENSMALL2,
]
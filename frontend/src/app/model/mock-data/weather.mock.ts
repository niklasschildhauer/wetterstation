import { IndoorRoomData, OutdoorWeatherData, WeatherHistoryByDayData, PollenData, WeatherForecastData, WeatherHistoryData, WeatherType, Tile, TileType, WeatherData, TilePriority } from '../weather';
import { Pollen } from '../user-context';

export var OUTDOORWEATHER: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 14,
    humidity: 66,
    timestamp: new Date('May 17, 2021 07:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER2: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 17, 2021 08:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER3: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 17, 2021 09:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER4: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 17, 2021 10:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER10: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date('May 16, 2021 07:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER12: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 16, 2021 08:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER13: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 14, 2021 09:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var OUTDOORWEATHER14: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 14, 2021 10:24:00'),
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var FORECAST: WeatherForecastData = {
    forecast: "Sonnig"
}

export var FORECASTTILE: Tile<WeatherForecastData> = {
    type: TileType.forecast,
    data: FORECAST,
    id: "FORECAST",
    priority: TilePriority.low,
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
        today: 3,
        tomorrow: 0,
    },

    {
        name: "Erle",
        type: Pollen.Erle,
        today: 0,
        tomorrow: 0,
    },
];

export var reducePollen = () => {
    POLLEN[0].today = 3
    POLLEN[1].today = 3
    POLLEN[2].today = 3
    POLLEN[3].today = 3

    OUTDOORWEATHER.temperature = OUTDOORWEATHER.temperature + 1;
    FORECAST.forecast = "lol"
    WOHNZIMMER.airQuality =   WOHNZIMMER.airQuality - 10;

}


export var POLLENSMALL: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: ESCHE,
    id: ESCHE.name,
    priority: TilePriority.low,
}
  
export var POLLENSMALL2: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: BIRKE,
    id: BIRKE.name,
    priority: TilePriority.low,
}
  
export var POLLENLIST: Tile<PollenData[]> = {
    type: TileType.pollenList,
    data: POLLEN,
    id: "POLLENLIST",
    priority: TilePriority.low,
}

export var WOHNZIMMER: IndoorRoomData = {
    roomID: "328959845524",
    roomName: "Wohnzimmer",
    airQuality: 102,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
}

export var SCHLAFZIMMER: IndoorRoomData =  {
    roomID: "15359845524",
    roomName: "Schlafzimmer",
    airQuality: 12,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
}

export var WOHNZIMMER2: IndoorRoomData = {
    roomID: "328959845524",
    roomName: "Wohnzimmer2",
    airQuality: 12,
    temperature: 2,
    humidity: 50,
    timestamp: new Date(),
}

export var SCHLAFZIMMER2: IndoorRoomData =  {
    roomID: "15359845524",
    roomName: "Schlafzimmer2",
    airQuality: 2,
    temperature: 22,
    humidity: 5,
    timestamp: new Date(),
}

export var INDOORAIRQUALITY2: IndoorRoomData[] = [
    WOHNZIMMER2,
    SCHLAFZIMMER2
];



export var INDOORAIRQUALITY: IndoorRoomData[] = [
    WOHNZIMMER,
    SCHLAFZIMMER
];

export var INDOORROOM1: Tile<IndoorRoomData> = {
    type: TileType.indoorRoom,
    data: WOHNZIMMER,
    id: SCHLAFZIMMER.roomID,
    priority: TilePriority.low,
}
  
export var INDOORROOM2: Tile<IndoorRoomData> = {
    type: TileType.indoorRoom,
    data: SCHLAFZIMMER,
    id: SCHLAFZIMMER.roomID,
    priority: TilePriority.low,
}

export var WEATHERHISTORY: WeatherHistoryData = {
    datapoints: [
        OUTDOORWEATHER,
        OUTDOORWEATHER10,
        OUTDOORWEATHER2,
        OUTDOORWEATHER13,
        OUTDOORWEATHER14,
        OUTDOORWEATHER4,
        OUTDOORWEATHER3,
        OUTDOORWEATHER12,
       
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
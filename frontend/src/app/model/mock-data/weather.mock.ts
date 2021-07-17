import { IndoorRoomData, OutdoorWeatherData, WeatherHistoryByDayData, PollenData, WeatherForecastData, WeatherHistoryData, Tile, TileType, WeatherData, TilePriority } from '../weather';

/**
 * MOCK DATA
 */
export var OUTDOORWEATHER: OutdoorWeatherData = {
    temperature: 25,
    maxTemperature: 20,
    minTemperature: 14,
    humidity: 46,
    timestamp: new Date('May 17, 2021 07:24:00'),
    weather: "sunny_cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '70565'
};

export var OUTDOORWEATHER2: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 17, 2021 08:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER3: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 17, 2021 09:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER4: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 17, 2021 10:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER10: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date('May 16, 2021 07:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER12: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 16, 2021 08:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER13: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 14, 2021 09:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER14: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 14, 2021 10:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER11: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 13, 2021 08:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549',
};

export var OUTDOORWEATHER321: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 13, 2021 09:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER41: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 18, 2021 10:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER110: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date('May 19, 2021 07:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER112: OutdoorWeatherData = {
    temperature: 15,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 50,
    timestamp: new Date('May 12, 2021 08:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER113: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 40,
    timestamp: new Date('May 11, 2021 09:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHER114: OutdoorWeatherData = {
    temperature: 18,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 10, 2021 10:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};

export var OUTDOORWEATHE3R114: OutdoorWeatherData = {
    temperature: 20,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 19, 2021 10:34:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};
export var OUTDOORWEA3THE3R114: OutdoorWeatherData = {
    temperature: 8,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 70,
    timestamp: new Date('May 19, 2021 10:24:00'),
    weather: "cloudy",
    apparentTemperature: 12,
    location: "Stuttgart",
    postCode: '71549'
};


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
        OUTDOORWEATHER114,
        OUTDOORWEATHER113,
        OUTDOORWEATHER112,
        OUTDOORWEATHER110,
        OUTDOORWEATHER41,
        OUTDOORWEATHER321,
        OUTDOORWEATHER11,
        OUTDOORWEATHE3R114,
        OUTDOORWEA3THE3R114,
    ]
}

export var FORECAST: WeatherForecastData = {
    trend: "falling",
    weatherDescription: "Rainy",
    weatherIcon: "rainy"
  }

export var FORECASTTILE: Tile<WeatherForecastData> = {
    type: TileType.forecast,
    data: FORECAST,
    id: "FORECAST",
    priority: TilePriority.low,
}

export var ESCHE: PollenData =  {
    pollenName: "Esche",
    id : 1,
    today: '0',
    tomorrow: '0',
}

export var ROGGEN: PollenData =  {
    pollenName: "Roggen",
    id: 2,
    today: '1',
    tomorrow: '0',
}

export var HASEL: PollenData =  {
    pollenName: "Hasel",
    id: 3,
    today: '1',
    tomorrow: '0',
}

export var BIRKE: PollenData =  {
    pollenName: "Birke",
    id: 4,
    today: '2',
    tomorrow: '0',
}

export var AMBROSIA: PollenData =  {
    pollenName: "Ambrosia",
    id: 5,
    today: '3',
    tomorrow: '0',
}

export var POLLEN: PollenData[] = [
    ESCHE,
    ROGGEN,
    HASEL,
    AMBROSIA,
    BIRKE,
    {
        pollenName: "Beifuß",
        id: 6,
        today: '0',
        tomorrow: '0',
    },

    {
        pollenName: "Gräser",
        id: 7,
        today: '3',
        tomorrow: '0',
    },

    {
        pollenName: "Erle",
        id: 8,
        today: '0',
        tomorrow: '0',
    },
];

export var POLLENSMALL: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: ESCHE,
    id: ESCHE.id + "",
    priority: TilePriority.low,
}
  
export var POLLENSMALL2: Tile<PollenData> = {
    type: TileType.pollenSmall,
    data: BIRKE,
    id: BIRKE.id + "",
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
    airQuality: 26,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
    calibrationValue: 25,

}

export var SCHLAFZIMMER: IndoorRoomData =  {
    roomID: "15359845524",
    roomName: "Schlafzimmer",
    airQuality: 12,
    temperature: 22,
    humidity: 50,
    timestamp: new Date(),
    calibrationValue: -1,
}

export var WOHNZIMMER2: IndoorRoomData = {
    roomID: "328959845524",
    roomName: "Wohnzimmer2",
    airQuality: 12,
    temperature: 2,
    humidity: 50,
    timestamp: new Date(),
    calibrationValue: 25,
}

export var SCHLAFZIMMER2: IndoorRoomData =  {
    roomID: "15359845524",
    roomName: "Schlafzimmer2",
    airQuality: 2,
    temperature: 22,
    humidity: 5,
    timestamp: new Date(),
    calibrationValue: 25,
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
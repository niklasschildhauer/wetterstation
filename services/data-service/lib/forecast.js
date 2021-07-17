"use strict"

//Use with genericRequestHandlers.genericRequest(...)


const genericRequestHandlers = require("./shared");

//set weather forecast frequency in minutes
let minutes = 10, the_interval = minutes * 60 * 1000;

//The below code is run every X minutes, where X is defined by the minutes variable above. In summary the anonymus function below
//gets the altitude for the weather sensor location from a external API and then calls our forecast function to get a weather forecast for the current timestep
setInterval(function () {
    console.log("worker start")
    const openweathermap_api_key = 'c23b6eb0df192e3eed784aa71777b7da'
    
    genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/espconfig/all").then((esp_configs) => {
        //Below store the postal code which is stored in the espconfig which is queried with the line above
        const postalCode = esp_configs[esp_configs.length - 1]["postalCode"];
        console.log("id", esp_configs[esp_configs.length - 1]["id"]);
        console.log("code", postalCode);

        const request_uri = `https://api.openweathermap.org/data/2.5/weather?zip=${postalCode},DE&appid=${openweathermap_api_key}`;
        genericRequestHandlers.genericRequestToPromise("GET", request_uri).then((object_with_coordinates) => {
            //Below store the latitude and longitude of the location of the postal code by querying the openweathermap API above
            const lat = object_with_coordinates['coord']['lat'];
            const lon = object_with_coordinates['coord']['lon'];
            //With this information the altitude of the location is queried below by using the opentopodata API
            const opentopodata_request_uri = `https://api.opentopodata.org/v1/eudem25m?locations=${lat},${lon}`;
            genericRequestHandlers.genericRequestToPromise("GET", opentopodata_request_uri).then((elevation_data) => {
                console.log('obj', object_with_coordinates);
                // console.log("elevation_data", elevation_data)
                //Run the forecast function which creates a weather forecast and pass the fetched altitude information
                forecast(elevation_data['results'][0]['elevation']);
            }).catch((err) => {
                console.log("(Forecast) Error getting api opentopodata")
                console.log("Error:", err)
            });
        }).catch((err) => {
            console.log("(Forecast) Error getting api openweathermap")
            console.log("Error:", err)
        });;
    }).catch((err) => {
        console.log("(Forecast) Error getting all esps")
        console.log("Error:", err)
    });
}, the_interval);

//This function takes the altitude in meters as a parameter and uses current sensor measurements to create a weather forecast for
//the current timestep. This forecast is stored in the corresponding forecast database table.
const forecast = (alt) => {
    let latest_measurement;

    //Forecast is based on last 10 sensor measurements => Last 9 interval measurements + current measurement
    //Line below queries current measurement
    genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/outdoor/latest").then((data) => {
        console.log("latest weather data", data)
        if (data !== undefined) {
            console.log('alt', alt);
            latest_measurement = data;
            //Below last 9 interval measurements are queried
            genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/forecast/history").then((data1) => {
                //Only pressure is used for forecast and data is reversed so newer measurements are at the higher indices 
                let pressureArray = data1.map(a => a.seaPressure).reverse();
                //Pad array with zeroes if shorter than length of 9
                pressureArray = Object.assign(new Array(9).fill(0), pressureArray);

                let temp_in_degrees = latest_measurement["temperature"];
                let altitude = alt;
                let pressure = latest_measurement["pressure"];

                //For zambretti algortihm we have to convert pressure measurement to atmospheric pressure reduced to sea level 
                let seapressure = calc_seapressure(pressure, temp_in_degrees, altitude);
                pressureArray.push(seapressure);
                let TodayDate = new Date();

                //let Z = 0;
                //Data structure of next forecast database entry
                let weather_forecast_response = {
                    "trend": "",
                    "weatherIcon": "",
                    "weatherDescription": "",
                    "seaPressure": 0
                };

                console.log("temp", temp_in_degrees);
                console.log("latest pressure", pressure);
                console.log("sea pressure", seapressure);
                console.log("pressure array", pressureArray);

                //This function calculates atmospheric pressure reduced to sea level 
                function calc_seapressure(pressure_to_be_converted, temp, altitude) {
                    let seapressure_res = pressure_to_be_converted * ((1 - (0.0065 * altitude / (temp + 0.0065 * altitude + 273.15))) ** -5.275);
                    return seapressure_res;
                }

                //This function calculates Z value of zambretti algorithm depending on pressure change and season
                function calc_zambretti(curr_pressure, prev_pressure, mon) {
                    if (curr_pressure < prev_pressure) {
                        //FALLING
                        if (mon >= 4 && mon <= 9)
                        //summer
                        {
                            if (curr_pressure >= 1030) {
                                return 2;
                            }
                            else if (curr_pressure >= 1020 && curr_pressure < 1030) {
                                return 8;
                            }
                            else if (curr_pressure >= 1010 && curr_pressure < 1020) {
                                return 18;
                            }
                            else if (curr_pressure >= 1000 && curr_pressure < 1010) {
                                return 21;
                            }
                            else if (curr_pressure >= 990 && curr_pressure < 1000) {
                                return 24;
                            }
                            else if (curr_pressure >= 980 && curr_pressure < 990) {
                                return 24;
                            }
                            else if (curr_pressure >= 970 && curr_pressure < 980) {
                                return 26;
                            }
                            else if (curr_pressure < 970) {
                                return 26;
                            }
                        } else {
                            //winter
                            if (curr_pressure >= 1030) {
                                return 2;
                            }
                            else if (curr_pressure >= 1020 && curr_pressure < 1030) {
                                return 8;
                            }
                            else if (curr_pressure >= 1010 && curr_pressure < 1020) {
                                return 15;
                            }
                            else if (curr_pressure >= 1000 && curr_pressure < 1010) {
                                return 21;
                            }
                            else if (curr_pressure >= 990 && curr_pressure < 1000) {
                                return 22;
                            }
                            else if (curr_pressure >= 980 && curr_pressure < 990) {
                                return 24;
                            }
                            else if (curr_pressure >= 970 && curr_pressure < 980) {
                                return 26;
                            }
                            else if (curr_pressure < 970) {
                                return 26;
                            }
                        }
                    } else if (curr_pressure > prev_pressure) {
                        //RAISING
                        if (mon >= 4 && mon <= 9) {
                            //summer
                            if (curr_pressure >= 1030) {
                                return 1;
                            }
                            else if (curr_pressure >= 1020 && curr_pressure < 1030) {
                                return 2;
                            }
                            else if (curr_pressure >= 1010 && curr_pressure < 1020) {
                                return 3;
                            }
                            else if (curr_pressure >= 1000 && curr_pressure < 1010) {
                                return 7;
                            }
                            else if (curr_pressure >= 990 && curr_pressure < 1000) {
                                return 9;
                            }
                            else if (curr_pressure >= 980 && curr_pressure < 990) {
                                return 12;
                            }
                            else if (curr_pressure >= 970 && curr_pressure < 980) {
                                return 17;
                            }
                            else if (curr_pressure < 970) {
                                return 17;
                            }
                        } else
                        //winter
                        {
                            if (curr_pressure >= 1030) {
                                return 1;
                            }
                            else if (curr_pressure >= 1020 && curr_pressure < 1030) {
                                return 2;
                            }
                            else if (curr_pressure >= 1010 && curr_pressure < 1020) {
                                return 6;
                            }
                            else if (curr_pressure >= 1000 && curr_pressure < 1010) {
                                return 7;
                            }
                            else if (curr_pressure >= 990 && curr_pressure < 1000) {
                                return 10;
                            }
                            else if (curr_pressure >= 980 && curr_pressure < 990) {
                                return 13;
                            }
                            else if (curr_pressure >= 970 && curr_pressure < 980) {
                                return 17;
                            }
                            else if (curr_pressure < 970) {
                                return 17;
                            }
                        }
                    } else {
                        if (curr_pressure >= 1030) {
                            return 1;
                        }
                        else if (curr_pressure >= 1020 && curr_pressure < 1030) {
                            return 2;
                        }
                        else if (curr_pressure >= 1010 && curr_pressure < 1020) {
                            return 11;
                        }
                        else if (curr_pressure >= 1000 && curr_pressure < 1010) {
                            return 14;
                        }
                        else if (curr_pressure >= 990 && curr_pressure < 1000) {
                            return 19;
                        }
                        else if (curr_pressure >= 980 && curr_pressure < 990) {
                            return 23;
                        }
                        else if (curr_pressure >= 970 && curr_pressure < 980) {
                            return 24;
                        }
                        else if (curr_pressure < 970) {
                            return 26;
                        }

                    }
                }

                console.log('pa[9]', pressureArray[9]);
                console.log('pa[8]', pressureArray[8]);
                console.log('pa[7]', pressureArray[7]);
                console.log('pa[0]', pressureArray[0]);
                console.log('pa[1]', pressureArray[1]);
                console.log('pa[2]', pressureArray[2]);
                console.log('Month', TodayDate.getMonth() + 1);

                //Call calc_zambretti function to get Z value
                let Z = calc_zambretti((pressureArray[9] + pressureArray[8] + pressureArray[7]) / 3, (pressureArray[0] + pressureArray[1] + pressureArray[2]) / 3, TodayDate.getMonth() + 1);

                console.log("Z", Z);

                //If-else structure to get final weather forecast for current timestep
                if (pressureArray[9] > 0 && pressureArray[0] > 0) {
                    if (pressureArray[9] + pressureArray[8] + pressureArray[7] - pressureArray[0] - pressureArray[1] - pressureArray[2] >= 3) {
                        //RISING
                        weather_forecast_response.trend = "rising";
                        if (Z < 3) {
                            weather_forecast_response.weatherIcon = "sunny";
                            weather_forecast_response.weatherDescription = "Clear";
                        } else if (Z >= 3 && Z <= 9) {
                            weather_forecast_response.weatherIcon = "sunny_cloudy";
                            weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                        } else if (Z > 9 && Z <= 17) {
                            weather_forecast_response.weatherIcon = "cloudy";
                            weather_forecast_response.weatherDescription = "Rather cloudy";
                        }
                        else if (Z > 17) {
                            weather_forecast_response.weatherIcon = "rainy";
                            weather_forecast_response.weatherDescription = "Rainy";
                        }
                    } else if (pressureArray[0] + pressureArray[1] + pressureArray[2] - pressureArray[9] - pressureArray[8] - pressureArray[7] >= 3) {
                        //FALLING
                        weather_forecast_response.trend = "falling";
                        if (Z < 4) {
                            weather_forecast_response.weatherIcon = "sunny";
                            weather_forecast_response.weatherDescription = "Clear";
                        }
                        else if (Z >= 4 && Z < 14) {
                            weather_forecast_response.weatherIcon = "sunny_cloudy";
                            weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                        } else if (Z >= 14 && Z < 19) {
                            weather_forecast_response.weatherIcon = "worsening";
                            weather_forecast_response.weatherDescription = "Worsening";
                        } else if (Z >= 19 && Z < 21) {
                            weather_forecast_response.weatherIcon = "cloudy";
                            weather_forecast_response.weatherDescription = "Rather cloudy";
                        }
                        else if (Z >= 21) {
                            weather_forecast_response.weatherIcon = "rainy";
                            weather_forecast_response.weatherDescription = "Rainy";
                        }
                    } else {
                        //STEADY
                        weather_forecast_response.trend = "steady";
                        if (Z < 5) {
                            weather_forecast_response.weatherIcon = "sunny";
                            weather_forecast_response.weatherDescription = "Clear";
                        }
                        else if (Z >= 5 && Z <= 11) {
                            weather_forecast_response.weatherIcon = "sunny_cloudy";
                            weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                        } else if (Z > 11 && Z < 14) {
                            weather_forecast_response.weatherIcon = "cloudy";
                            weather_forecast_response.weatherDescription = "Rather cloudy";
                        }
                        else if (Z >= 14 && Z < 19) {
                            weather_forecast_response.weatherIcon = "worsening";
                            weather_forecast_response.weatherDescription = "Worsening";
                        } else if (Z > 19) {
                            weather_forecast_response.weatherIcon = "rainy";
                            weather_forecast_response.weatherDescription = "Rainy";
                        }
                    }
                } else {
                    if (seapressure < 1005) {
                        weather_forecast_response.weatherIcon = "rainy";
                        weather_forecast_response.weatherDescription = "Rainy";
                    }
                    else if (seapressure >= 1005 && seapressure <= 1015) {
                        weather_forecast_response.weatherIcon = "cloudy";
                        weather_forecast_response.weatherDescription = "Rather cloudy";
                    }
                    else if (seapressure > 1015 && seapressure < 1025) {
                        weather_forecast_response.weatherIcon = "sunny_cloudy";
                        weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                    }
                    else {
                        weather_forecast_response.weatherIcon = "rainy";
                        weather_forecast_response.weatherDescription = "Rainy";
                    }
                }

                weather_forecast_response.seaPressure = seapressure;
                console.log("forecast_res", weather_forecast_response);


                //------------------------------ write forecast to forecast table --------------------------------

                genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/forecast/insert", JSON.stringify(weather_forecast_response)).then((inserted) => {
                    if (inserted.hasOwnProperty("message")) {
                        console.log(inserted.message)
                    } else {
                        console.log("reqdata", inserted);
                    }
                }).catch((err) => {
                    console.log("(Forecast) Error inserting forecast")
                    console.log("Error:", err)
                });

                //------------------------------------------------------------------------------------------------
            }).catch((err) => {
                console.log("(Forecast) Error getting history data")
                console.log("Error:", err)
            });
        }
    }).catch((err) => {
        console.log("(Forecast) Error getting latest outdoor weather data")
        console.log("Error:", err)
    });
    //--------------------------------------------------------------------------------------------------------

}

module.exports = {
    forecast: forecast
}

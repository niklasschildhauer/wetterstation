"use strict"

//Use with genericRequestHandlers.genericRequest(...)


const cron = require("node-cron");
let CronJob = require("cron").CronJob;
const genericRequestHandlers = require("./shared");

//let pressureArray = [1022.8, 1023.3, 1023.8, 1024, 1024.1, 1024, 1023.7, 2000.2, 2300.4, 2400];
//let counter = 0;

//cron.schedule("*/1 * * * *", () => {
//    forecast();
//});

//const job = new CronJob("*/1 * * * *", function() {
//	forecast();
//});
//job.start(); 

let minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function () {
    forecast();
}, the_interval);

const forecast = () => {
    let latest_measurement;

    //--------------------------------------- Get DB data necessary for forecast -----------------------------
    genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/outdoor/latest").then((data) => {
        console.log("latest");
        latest_measurement = data;
        genericRequestHandlers.genericRequestToPromise("GET", "http://localhost:4205/forecast/history").then((data1) => {
            let pressureArray = data1.map(a => a.seaPressure).reverse();

            let temp_in_degrees = latest_measurement["temperature"];
            let altitude = 296;
            let pressure = latest_measurement["pressure"];

            //for debug purposes
            temp_in_degrees = 9;
            pressure = 1017 ;

            let seapressure = calc_seapressure(pressure, temp_in_degrees, altitude);
            pressureArray.push(seapressure);
            let TodayDate = new Date();

            //let Z = 0;
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


            function calc_seapressure(pressure_to_be_converted, temp, altitude) {
                let seapressure_res = pressure_to_be_converted * ((1 - (0.0065 * altitude / (temp + 0.0065 * altitude + 273.15))) ** -5.275);
                return seapressure_res;
            }

            function calc_zambretti(curr_pressure, prev_pressure, mon) {
                if (curr_pressure < prev_pressure) {
                    //FALLING
                    if (mon >= 4 && mon <= 9)
                    //summer
                    {
                        if (curr_pressure >= 1030){
                            return 2;
                        }
                        else if (curr_pressure >= 1020 && curr_pressure < 1030){
                            return 8;
                        }
                        else if (curr_pressure >= 1010 && curr_pressure < 1020){
                            return 18;
                        }
                        else if (curr_pressure >= 1000 && curr_pressure < 1010){
                            return 21;
                        }
                        else if (curr_pressure >= 990 && curr_pressure < 1000){
                            return 24;
                        }
                        else if (curr_pressure >= 980 && curr_pressure < 990){
                            return 24;
                        }
                        else if (curr_pressure >= 970 && curr_pressure < 980){
                            return 26;
                        }
                        else if (curr_pressure < 970){
                            return 26;
                        }
                    } else {
                        //winter
                        if (curr_pressure >= 1030){
                            return 2;
                        }
                        else if (curr_pressure >= 1020 && curr_pressure < 1030){
                            return 8;
                        }
                        else if (curr_pressure >= 1010 && curr_pressure < 1020){
                            return 15;
                        }
                        else if (curr_pressure >= 1000 && curr_pressure < 1010){
                            return 21;
                        }
                        else if (curr_pressure >= 990 && curr_pressure < 1000){
                            return 22;
                        }
                        else if (curr_pressure >= 980 && curr_pressure < 990){
                            return 24;
                        }
                        else if (curr_pressure >= 970 && curr_pressure < 980){
                            return 26;
                        }
                        else if (curr_pressure < 970){
                            return 26;
                        }
                    }
                } else if (curr_pressure > prev_pressure) {
                    //RAISING
                    if (mon >= 4 && mon <= 9) {
                        //summer
                        if (curr_pressure >= 1030){
                            return 1;
                        }
                        else if (curr_pressure >= 1020 && curr_pressure < 1030){
                            return 2;
                        }
                        else if (curr_pressure >= 1010 && curr_pressure < 1020){
                            return 3;
                        }
                        else if (curr_pressure >= 1000 && curr_pressure < 1010){
                            return 7;
                        }
                        else if (curr_pressure >= 990 && curr_pressure < 1000){
                            return 9;
                        }
                        else if (curr_pressure >= 980 && curr_pressure < 990){
                            return 12;
                        }
                        else if (curr_pressure >= 970 && curr_pressure < 980){
                            return 17;
                        }
                        else if (curr_pressure < 970){
                            return 17;
                        }
                    } else
                    //winter
                    {
                        if (curr_pressure >= 1030){
                            return 1;
                        }
                        else if (curr_pressure >= 1020 && curr_pressure < 1030){
                            return 2;
                        }
                        else if (curr_pressure >= 1010 && curr_pressure < 1020){
                            return 6;
                        }
                        else if (curr_pressure >= 1000 && curr_pressure < 1010){
                            return 7;
                        }
                        else if (curr_pressure >= 990 && curr_pressure < 1000){
                            return 10;
                        }
                        else if (curr_pressure >= 980 && curr_pressure < 990){
                            return 13;
                        }
                        else if (curr_pressure >= 970 && curr_pressure < 980){
                            return 17;
                        }
                        else if (curr_pressure < 970){
                            return 17;
                        }
                    }
                } else {
                    if (curr_pressure >= 1030){
                        return 1;
                    }
                    else if (curr_pressure >= 1020 && curr_pressure < 1030){
                        return 2;
                    }
                    else if (curr_pressure >= 1010 && curr_pressure < 1020){
                        return 11;
                    }
                    else if (curr_pressure >= 1000 && curr_pressure < 1010){
                        return 14;
                    }
                    else if (curr_pressure >= 990 && curr_pressure < 1000){
                        return 19;
                    }
                    else if (curr_pressure >= 980 && curr_pressure < 990){
                        return 23;
                    }
                    else if (curr_pressure >= 970 && curr_pressure < 980){
                        return 24;
                    }
                    else if (curr_pressure < 970){
                        return 26;
                    }

                }
            }

            console.log('pa[9]',pressureArray[9]); 
            console.log('pa[8]',pressureArray[8]);
            console.log('pa[7]',pressureArray[7]);
            console.log('pa[0]',pressureArray[0]);
            console.log('pa[1]',pressureArray[1]);
            console.log('pa[2]',pressureArray[2]);
            console.log('Month',TodayDate.getMonth() + 1);
            
            let Z = calc_zambretti((pressureArray[9] + pressureArray[8] + pressureArray[7]) / 3, (pressureArray[0] + pressureArray[1] + pressureArray[2]) / 3, TodayDate.getMonth() + 1);

            console.log("Z", Z);

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
                    } else if (Z >= 19 && Z < 21){
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
                    if (Z < 5){
                        weather_forecast_response.weatherIcon = "sunny";
                        weather_forecast_response.weatherDescription = "Clear";
                    }
                    else if (Z >= 5 && Z <= 11) {
                        weather_forecast_response.weatherIcon = "sunny_cloudy";
                        weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                    } else if (Z > 11 && Z < 14){
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
                if (seapressure < 1005){
                    weather_forecast_response.weatherIcon = "rainy";
                    weather_forecast_response.weatherDescription = "Rainy";
                }
                else if (seapressure >= 1005 && seapressure <= 1015){
                    weather_forecast_response.weatherIcon = "cloudy";
                    weather_forecast_response.weatherDescription = "Rather cloudy";
                }
                else if (seapressure > 1015 && seapressure < 1025){
                    weather_forecast_response.weatherIcon = "sunny_cloudy";
                    weather_forecast_response.weatherDescription = "Sunny and moderately cloudy.";
                }
                else{
                    weather_forecast_response.weatherIcon = "rainy";
                    weather_forecast_response.weatherDescription = "Rainy";
                }
            }

            //weather_forecast_response.weatherDescription = "FIXME";
            weather_forecast_response.seaPressure = seapressure;
            console.log("forecast_res", weather_forecast_response);


            //------------------------------ write forecast to forecast table --------------------------------

            genericRequestHandlers.genericRequestWithPayloadToPromise("POST", "http://localhost:4205/forecast/insert", JSON.stringify(weather_forecast_response)).then((data) => {
                console.log("reqdata", data);
            });

            //------------------------------------------------------------------------------------------------
        })
    })
    //--------------------------------------------------------------------------------------------------------

}

//forecast();

module.exports = {
    forecast: forecast
}

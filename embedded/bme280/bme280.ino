#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>


Adafruit_BME280 bme; // I2C

void setup() {
  
  Serial.begin(9600);

 
 // 0x76 and 0x77 are possible
 // bool communication = bme.begin();
 
  bool communication = bme.begin(0x76);
 
  if (!communication) {
  
   Serial.println("Could not find a valid BME280 sensor");
   Serial.println("check wiring, address, sensor ID!");
   Serial.print("SensorID was: 0x");
   Serial.println(bme.sensorID(), 16);
   Serial.println("ID of 0xFF probably means a bad address\n");
   
  while (true) { };
    delay(10);
  }
  else {
    Serial.println("Communication established!\n");
  }
 }

void loop() {
  
 Serial.print("Temperature = ");
 Serial.print(bme.readTemperature());
 Serial.println(" *C");
 Serial.print("Pressure = ");
 Serial.print(bme.readPressure() / 100.0F);
 Serial.println(" hPa");
 Serial.print("Humidity = ");
 Serial.print(bme.readHumidity());
 Serial.println(" %\n");
 delay(1000);
 
}

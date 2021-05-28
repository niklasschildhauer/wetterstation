#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <HTTPClient.h>


Adafruit_BME280 bme; // I2C

const char* ssid     = "FRITZ!Box 7590 UK";                   //"Vodafone-1F7F"; //name of your wifi
const char* password = "81352968356302772244";                 //"ABbpgU3aGaNmedUm"; //pw of your wifi
const char* serverip = "192.168.0.136:4204"; //add server ip and port
#define SERVER_IP "192.168.178.30:4201"                                //"192.168.0.136:4201"

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

   // We start by connecting to a WiFi network

    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    WiFiClient client;
    HTTPClient http;
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

 WiFiClient client;
  HTTPClient http;
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
   

    Serial.print("[HTTP] begin...\n");
    // configure target server and url //error in this line > might be fixed by a running server
    http.begin(client, "http://" SERVER_IP"/v1/sensors/outdoor"); //HTTP
    http.addHeader("Content-Type", "application/json");


    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    char buffer[200];
    
    char location[] = "hier";
    sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"pressure\":\"%.2f\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), bme.readPressure()/ 100.0F, location);
    Serial.println(buffer);
    
    int httpCode = http.POST(buffer);
   
    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("received payload:\n<<");
        Serial.println(payload);
        Serial.println(">>");    
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }
}
